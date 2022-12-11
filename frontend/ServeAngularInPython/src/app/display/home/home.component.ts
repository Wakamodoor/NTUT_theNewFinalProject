import { FooterComponent } from './../../footer/footer.component';
import { SocketService } from '../../helper/services/socket.service';
import { ChartService } from '../../helper/services/chart.service';
import { Component, Inject, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
import { concatMap, filter, forkJoin, map, range } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import 'moment/locale/ja';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import * as moment from 'moment';
import SimpleParallax from 'simple-parallax-js';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM',
  },
  display: {
    dateInput: 'YYYY/MM',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY MMMM',
  },
};


type EChartsOption = echarts.EChartsOption;

interface wordcloudData {
  name: string,
  value: number
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'zh-tw'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class HomeComponent implements OnInit {

  formData: FormGroup

  wordcloudOp = {}

  leaderboardData = []

  everGreenKOL = ['阿土伯', 'E神']
  // chartDom = document.getElementById('linechart')!;

  chartData: any

  options: EChartsOption = {}

  stock: string
  queryDate: string

  finishLoading: boolean = false


  constructor(
    private cs: ChartService,
    private socket: SocketService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {
    // if( window.localStorage ) {
    //   if( !localStorage.getItem('firstLoad') ) {
    //     localStorage['firstLoad'] = true;
    //     window.location.reload();
    //   }else {
    //     localStorage.removeItem('firstLoad');
    //   }
    // }
  }

  ngOnInit(): void {
    this.formData = this.createQueryForm()
    this.setMonthAndYear(this.formData.getRawValue().date)
    this.stock = this.route.snapshot.paramMap.get('stock')

    this._adapter.setLocale(this._locale);
    // this.parallax()
  }

  queryKolrank(year: string, month: string) {
    this.socket.getKOLRankAPI(year, month).subscribe((rel) => {
      this.leaderboardData = JSON.parse(JSON.stringify(rel.response))
    })
  }

  queryMonthWordcloud(year: string, month: string) {
    this.socket.getMonthWordcloudAPI(year, month).subscribe(rel => {
      console.log(rel.response)
      this.finishLoading = true
      const data: any = JSON.parse(JSON.stringify(rel.response))
      let WCData: Array<wordcloudData> = []

      data.forEach(arr => {
        const tmpObj = {
          name: arr[0],
          value: arr[1]
        }
        WCData.push(tmpObj)
      });
      this.wordcloudOp = this.cs.wordCloud(WCData)
    })
  }

  gokolchart1(author: string) {
    this.router.navigateByUrl(`home/${this.stock}/${author}/${this.queryDate}/kolchart1`)
  }

  private createQueryForm(): FormGroup {
    return this.fb.group({
      date: [{value: moment(new Date('2022/05/31')), disabled: true}, Validators.required]
    });
  }

  setMonthAndYear(normalizedMonthAndYear?: Moment, datepicker?: MatDatepicker<Moment>) {
    const ctrlValue = this.formData.getRawValue()['date']!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.formData.get('date').setValue(ctrlValue);
    this.queryDate = `${normalizedMonthAndYear.year()}年${normalizedMonthAndYear.month()+1}月`

    if(datepicker) {
      datepicker.close();
    }

    this.queryKolrank((normalizedMonthAndYear.year()).toString(), (normalizedMonthAndYear.month()+1).toString())
    this.queryMonthWordcloud((normalizedMonthAndYear.year()).toString(), (normalizedMonthAndYear.month()+1).toString())
  }

  private parallax() {
    let img1 = document.getElementsByClassName("parallax_img")
    new SimpleParallax(img1, {
      scale: 1.5,
      orientation: "down",
      overflow: true,
      delay: .5,
      transition: 'cubic-bezier(0,0,.58,1)'
    })
  }

  getTooltipText(idx: number) {
    switch (idx) {
      case 1:
        return `
        發文量：作者單月總發文量
          按讚數：作者單月發文獲得之總按讚數
          留言數：作者單月發文獲得之總留言數
        `
      case 2:
        return `
        以本月所選股票(長榮/鴻海)之所有發文來做斷詞並計算詞頻，
        文字雲中字越大者，代表詞頻越高，也代表是本月熱門關鍵字。
      `
    }
    return 'nothing'
  }

}

