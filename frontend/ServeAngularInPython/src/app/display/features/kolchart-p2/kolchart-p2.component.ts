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
  year: string
  month: string

  negPercent: number;
  posPercent: number;
  neuPercent: number;

  wcNoData: boolean = false;


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
      this.year = this.queryDate.slice(0,4)
      this.month = this.queryDate.slice(5,7).replace('月', '')
      this.queryDailyPostChart(this.author, this.year, this.month)
      setTimeout(() => {
        document.getElementById('author_date_info').setAttribute('class', 'author_date_info author_date_info_start')
      }, 1000);
      setTimeout(() => {
        document.getElementById('author_date_info').setAttribute('class', 'author_date_info')
      }, 4000);
      // this.queryWordcloud(this.author, this.queryDate)
      // this.getEmotionalBar()
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
    this.socket.getDailyPostAPI(author, year, month, this.stock).subscribe(rel => {
      const data = JSON.parse(JSON.stringify(rel.response))
      console.log(data)
      let xData = []
      // let xData_post = []
      let yData_post = []
      // let xData_closePrice = []
      let yData_closePrice = []

      data.forEach(obj => {
        xData.push(obj['日期'].replaceAll('-', '/'))
        yData_post.push(obj['日發文數'])
      });

      this.socket.getDailyPriceAPI(year, month, this.stock).subscribe(rel=> {
        const data2 = JSON.parse(JSON.stringify(rel))

        data2.forEach(obj => {
          yData_closePrice.push([obj['DATE(DATETIME)'], obj['endprice']])
        });
        this.options = this.cs.dailyPost(xData, yData_post, yData_closePrice)
        document.getElementById('daily-post-chart').style.opacity = '1'
        this.queryWordcloud(this.author, this.queryDate)
      })

    })
  }

  queryWordcloud(author: string, date: string) {
    // const year = date.slice(0, 4)
    // const month = date.slice(5, 6)
    let startDate = `${this.year}-${this.month}-01`
    let endDate = `${this.year}-${this.month}-31`

    this.buildWordCloud(author, startDate, endDate)
  }

  buildWordCloud(author: string, startDate: string, endDate: string) {
    this.socket.getWordcloudAPI(author, startDate, endDate, this.stock).subscribe(rel => {
      const data: any = rel.response
      let WCData: Array<wordcloudData> = []
      console.log(data)
      if(data.length === 0) {
        this.wcNoData = true
        return
      }
      data.forEach(arr => {
        const tmpObj = {
          name: arr[0],
          value: arr[1]
        }
        WCData.push(tmpObj)
      });
      this.wordcloudOp = this.cs.wordCloud(WCData, this.maskImage)
      document.getElementById('wordcloud').style.opacity = '1'
      this.getEmotionalBar()
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
      case 2:
        return `
        溫度計為本月該作者所有文章的情緒正負向。
        `
    }
    return 'nothing'
  }

  getEmotionalBar() {
    this.socket.getAuthorEmotionalBarAPI(this.author, this.year, this.month, this.stock).subscribe((rel) => {
      const data = JSON.parse(JSON.stringify((rel.response)))
      const total = data['中立字詞次數'] + data['正向字詞次數'] + data['負向字詞次數']
      this.posPercent = Math.floor((data['正向字詞次數'] / total)*100)
      this.negPercent = Math.floor((data['負向字詞次數'] / total)*100)
      this.neuPercent = Math.floor((data['中立字詞次數'] / total)*100)
      document.getElementById('emotion-bar').style.opacity = '1';
      document.getElementById('positive').style.opacity = '1';
      document.getElementById('negative').style.opacity = '1';
      document.getElementById('neutrality').style.opacity = '1';
    })
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
