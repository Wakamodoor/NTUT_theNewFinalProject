import { FooterComponent } from './../../footer/footer.component';
import { NodatasnakebarComponent } from './../../helper/tools/nodatasnakebar/nodatasnakebar.component';
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
import { MatSnackBar } from '@angular/material/snack-bar';

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

  leaderboardData = []

  everGreenKOL = ['阿土伯', 'E神']
  // chartDom = document.getElementById('linechart')!;

  chartData: any

  options: EChartsOption = {}

  stock: string
  queryDate: string

  isHome2: boolean =  false;

  year: any;
  month: any;

  constructor(
    private cs: ChartService,
    private socket: SocketService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _adapter: DateAdapter<any>,
    private _snackBar: MatSnackBar,
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
    this.stock = this.route.snapshot.paramMap.get('stock')
    this.setMonthAndYear(this.formData.getRawValue().date)

    this._adapter.setLocale(this._locale);
    // this.parallax()
  }

  queryKolrank(year: string, month: string) {
    this.socket.getKOLRankAPI(year, month, this.stock).subscribe((rel) => {
      this.leaderboardData = JSON.parse(JSON.stringify(rel.response))
      if(this.leaderboardData.length === 0) {
        this.openSnackBar()
      }
      this.leaderboardData.forEach((obj, idx) => {
        this.socket.getAuthorEmotionalBarAPI(obj['username'], this.year, this.month, this.stock).subscribe((rel) => {
          const data = JSON.parse((JSON.stringify(rel.response)))
          const total = data['中立字詞次數'] + data['正向字詞次數'] + data['負向字詞次數']
          const posPercent = Math.floor((data['正向字詞次數'] / total)*100)
          const negPercent = Math.floor((data['負向字詞次數'] / total)*100)
          const neuPercent = Math.floor((data['中立字詞次數'] / total)*100)
          // document.getElementById(`emotion-bar${idx}`).style.opacity = '1';
          // document.getElementById(`'positive${idx}`).style.opacity = '1';
          // document.getElementById(`negative${idx}`).style.opacity = '1';
          // document.getElementById(`neutrality${idx}`).style.opacity = '1';
          this.leaderboardData[idx]['posPercent'] = posPercent;
          this.leaderboardData[idx]['negPercent'] = negPercent;
          this.leaderboardData[idx]['neuPercent'] = neuPercent;
        })
      })
    });
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
    this.year = (normalizedMonthAndYear.year()).toString()
    this.month = (normalizedMonthAndYear.month()+1).toString()
    this.queryKolrank((normalizedMonthAndYear.year()).toString(), (normalizedMonthAndYear.month()+1).toString())
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
        // if(this.stock === '2603') {
          return `
          當月份文章熱搜關鍵字
          `
        // }else {
          // return`
          // 以本月鴻海之所有發文來做斷詞並計算詞頻，
          // 文字雲中字越大者，也代表是本月熱門關鍵字。
          // `
        // }
      case 3:
        return`
        溫度計為本月該作者所有文章的情緒正負向。
        `
    }
    return 'nothing'
  }

  openSnackBar() {
    //   this._snackBar.open('研究資料來源：Cmoney股市同學會', '知道了！', {
    //     horizontalPosition: this.horizontalPosition,
    //     verticalPosition: this.verticalPosition,
    //     duration: this.durationInSeconds * 1000,
    //   });

    this._snackBar.openFromComponent(NodatasnakebarComponent, {
      duration: 3000,
      panelClass: [
        'snakebar-panel'
      ]
    });
  }

  goHome2() {
    this.isHome2 = true;
  }

  returnHome() {
    this.isHome2 = false;
  }

}

