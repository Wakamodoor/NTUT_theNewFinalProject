import { NodatasnakebarComponent } from './../../../helper/tools/nodatasnakebar/nodatasnakebar.component';
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
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  stock: string

  filteredOptions: Observable<string[]>;

  durationInSeconds: number = 3;

  constructor(
    private socket: SocketService,
    private cs: ChartService,
    private fb: FormBuilder,
    private _adapter: DateAdapter<any>,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) { }

  ngOnInit(): void {
    this.queryForm = this.createForm()
    // this.buildWordCloud()
    this.stock = this.route.snapshot.paramMap.get('stock')

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
    console.log(form)
    if(!this.queryForm.valid) {
      console.log('欄位檢核錯誤')
      return
    }
    const author = form.author
    let startDate = form.startDate['_i']
    console.log(startDate)
    startDate = `${startDate.year}-${startDate.month+1}-${startDate.date}`
    let endDate = form.endDate['_i']
    console.log(endDate)
    endDate = `${endDate.year}-${endDate.month+1}-${endDate.date}`
    console.log(author)
    this.buildWordCloud(author, startDate, endDate)
  }

  buildWordCloud(author: string, startDate: string, endDate: string) {
    this.socket.getWordcloudAPI(author, startDate, endDate, this.stock).subscribe(rel => {
      const data: any = rel.response
      if(data.length == 0) {
        this.openSnackBar()
        return
      }
      let WCData: Array<wordcloudData> = []

      data.forEach(arr => {
        const tmpObj = {
          name: arr[0],
          value: arr[1]
        }
        WCData.push(tmpObj)
      });
      this.wordcloudOp = this.cs.wordCloud(WCData, this.maskImage)
      document.getElementById('wordcloud-opacity').style.opacity = "1";
    })
  }

  backPrePage() {
    this.router.navigateByUrl(`home/${this.stock}`)
  }

  private createForm(): FormGroup {
    return this.fb.group({
      author: ['', Validators.required],
      startDate: [{value: '', disabled: true}, Validators.required],
      endDate: [{value: '', disabled: true} , Validators.required]
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.authorList.filter(option => option.toLowerCase().includes(filterValue));
  }

  openSnackBar() {
    //   this._snackBar.open('研究資料來源：Cmoney股市同學會', '知道了！', {
    //     horizontalPosition: this.horizontalPosition,
    //     verticalPosition: this.verticalPosition,
    //     duration: this.durationInSeconds * 1000,
    //   });

      this._snackBar.openFromComponent(NodatasnakebarComponent, {
        duration: this.durationInSeconds * 1000,
        panelClass: [
          'snakebar-panel'
        ]
      });
    }

  getTooltipText(idx: number) {
    switch (idx) {
      case 1:
        return `
        可直接輸入作者名稱，或是以選單方式選擇
        熱門KOL，並選擇一段期間，會以該作者在
        所選期間內的發文做斷詞，用斷詞結果算出
        詞頻，製作出文字雲，文字雲中字越大者，
        代表詞頻越高，也代表是該作者在選擇期間
        最常出現的關鍵字。
        `
    }
    return 'nothing'
  }
}
