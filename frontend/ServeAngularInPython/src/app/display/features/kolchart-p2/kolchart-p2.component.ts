import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartService } from './../../../helper/services/chart.service';
import { SocketService } from './../../../helper/services/socket.service';
import { Component, OnInit, Inject } from '@angular/core';
import * as echarts from 'echarts'
import 'echarts-wordcloud';
import { map, Observable, startWith } from 'rxjs';
import { Location } from '@angular/common'

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import 'moment/locale/ja';
import { ActivatedRoute } from '@angular/router';
import { EChartsOption } from 'echarts';

interface wordcloudData {
  name: string,
  value: number
}


@Component({
  selector: 'app-kolchart-p2',
  templateUrl: './kolchart-p2.component.html',
  styleUrls: ['./kolchart-p2.component.css'],
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
export class KolchartP2Component implements OnInit {

  queryForm: FormGroup

  maskImage  = new Image();
  wordcloudOp = {}

  authorList = ['阿土伯', 'E神', '趨勢King', '小曼姐姐', '中華英雄', 'kenviwang', '趨勢再走 勇氣要有(空軍司令)']
  option: string = ''

  fromKOL = false

  stock: string
  author: string
  queryDate: string

  options: EChartsOption = {}

  filteredOptions: Observable<string[]>;

  constructor(
    private socket: SocketService,
    private cs: ChartService,
    private fb: FormBuilder,
    private _adapter: DateAdapter<any>,
    private route: ActivatedRoute,
    private location: Location,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) { }

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('author')) {
      this.fromKOL = true
      this.stock = this.route.snapshot.paramMap.get('stock')
      this.author = this.route.snapshot.paramMap.get('author')
      this.queryDate = this.route.snapshot.paramMap.get('date')
      const year = this.queryDate.slice(0,4)
      const month = this.queryDate.slice(5,6)
      this.queryDailyPostChart(this.author, year, month)
      this.queryWordcloud(this.author, this.queryDate)
    }else {
      this.fromKOL = false
      this.queryForm = this.createForm()
      this.filteredOptions = this.queryForm.controls['author'].valueChanges.pipe(
        startWith(''),
        map((value: string) => this._filter(value || '')),
      );
      this._adapter.setLocale(this._locale);
    }
    // this.buildWordCloud()
    // this.route.queryParamMap.subscribe((paramsMap) => {
    //   if (paramsMap['params']['date']) {
    //     this.date = paramsMap['params']['date']
    //   }else if (paramsMap['params']['fromKOL']) {
    //     this.fromKOL = true
    //   }
    // })

    // this.maskImage.src = '../../../../assets/image/silhouette_cloud.png'
  }

  queryDailyPostChart(author: string, year: string, month: string) {
    this.socket.getDailyPostAPI(author, year, month).subscribe(rel => {
      const data = JSON.parse(JSON.stringify(rel.response))
      let xData = []
      // let xData_post = []
      let yData_post = []
      // let xData_closePrice = []
      let yData_closePrice = []

      data.forEach(obj => {
        xData.push(obj['日期'].replaceAll('-', '/'))
        yData_post.push(obj['日發文數'])
      });

      this.socket.getDailyPriceAPI(year, month).subscribe(rel=> {
        const data2 = JSON.parse(JSON.stringify(rel))

        data2.forEach(obj => {
          yData_closePrice.push([obj['DATE(DATETIME)'], obj['endprice']])
        });
        this.options = this.cs.dailyPost(xData, yData_post, yData_closePrice)
      })

    })
  }

  queryWordcloud(author: string, date: string) {
    const year = date.slice(0, 4)
    const month = date.slice(5, 6)
    let startDate = `${year}-${month}-01`
    let endDate = `${year}-${month}-31`

    this.buildWordCloud(author, startDate, endDate)
  }

  buildWordCloud(author: string, startDate: string, endDate: string) {
    this.socket.getWordcloudAPI(author, startDate, endDate).subscribe(rel => {
      const data: any = rel.response
      let WCData: Array<wordcloudData> = []
      console.log(data)
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

  backPrePage() {
    this.location.back()
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

  getTooltipText(idx: number) {
    switch (idx) {
      case 1:
        return `
        以所選股票(長榮/鴻海)之該作者本月所有發文
        來做斷詞並計算詞頻，文字雲中字越大者，代表
        詞頻越高，也代表是該作者本月最常出現的關鍵字。
        `
    }
    return 'nothing'
  }






  initWordCloud() {
    // this.wordcloudOp = this.cs.wordCloud()
    // const echarts = require('echarts')
    // require('echarts-wordcloud')
    // const myChart = echarts.init(document.getElementById('wordcloud'))
    // window.onresize = () => {
    //   myChart.resize()
    // }
  }
}
