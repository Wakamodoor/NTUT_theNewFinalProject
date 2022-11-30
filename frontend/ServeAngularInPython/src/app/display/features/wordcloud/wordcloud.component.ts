import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartService } from './../../../helper/services/chart.service';
import { SocketService } from './../../../helper/services/socket.service';
import { Component, OnInit, Inject } from '@angular/core';
import * as echarts from 'echarts'
import 'echarts-wordcloud';
import { map, Observable, startWith } from 'rxjs';

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import 'moment/locale/ja';
import { ActivatedRoute } from '@angular/router';

interface wordcloudData {
  name: string,
  value: number
}


@Component({
  selector: 'app-wordcloud',
  templateUrl: './wordcloud.component.html',
  styleUrls: ['./wordcloud.component.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'zh-tw'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class WordcloudComponent implements OnInit {
  queryForm: FormGroup

  maskImage  = new Image();
  wordcloudOp = {}

  authorList = ['阿土伯', 'E神', '趨勢King', '小曼姐姐', '中華英雄', 'kenviwang', '趨勢再走 勇氣要有(空軍司令)']
  option: string = ''

  fromKOL = false
  date: string

  filteredOptions: Observable<string[]>;

  constructor(
    private socket: SocketService,
    private cs: ChartService,
    private fb: FormBuilder,
    private _adapter: DateAdapter<any>,
    private route: ActivatedRoute,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) { }

  ngOnInit(): void {
    this.queryForm = this.createForm()
    // this.buildWordCloud()

    this.route.queryParamMap.subscribe((paramsMap) => {
      if (paramsMap['params']['date']) {
        this.date = paramsMap['params']['date']
      }else if (paramsMap['params']['fromKOL']) {
        this.fromKOL = true
      }
    })

    this.filteredOptions = this.queryForm.controls['author'].valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '')),
    );
    this._adapter.setLocale(this._locale);
    // this.maskImage.src = '../../../../assets/image/silhouette_cloud.png'
  }

  queryWC() {
    const form = this.queryForm.getRawValue()
    if(!this.queryForm.valid) {
      console.log('欄位檢核錯誤')
      return
    }
    const author = form.author
    let startDate = form.startDate['_i']
    startDate = `${startDate.year}-${startDate.month+1}-${startDate.date}`
    let endDate = form.endDate['_i']
    endDate = `${endDate.year}-${endDate.month+1}-${endDate.date}`
    console.log(author)
    this.buildWordCloud(author, startDate, endDate)
  }

  buildWordCloud(author: string, startDate: string, endDate: string) {
    this.socket.getWordcloudAPI(author, startDate, endDate).subscribe(rel => {
      const data: any = rel.response
      let WCData: Array<wordcloudData> = []

      data.forEach(arr => {
        const tmpObj = {
          name: arr[0],
          value: arr[1]
        }
        WCData.push(tmpObj)
      });
      this.wordcloudOp = this.cs.wordCloud(WCData, this.maskImage)
    })
  }



  private createForm(): FormGroup {
    return this.fb.group({
      author: ['', Validators.required],
      startDate: ['' , Validators.required],
      endDate: ['' , Validators.required]
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.authorList.filter(option => option.toLowerCase().includes(filterValue));
  }
}
