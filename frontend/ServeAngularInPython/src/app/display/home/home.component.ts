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

  everGreenKOL = ['阿土伯', 'E神']
  // chartDom = document.getElementById('linechart')!;

  chartData: any

  options: EChartsOption = {}

  stock: string

  title_text: string


  constructor(
    private cs: ChartService,
    private socket: SocketService,
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) { }

  ngOnInit(): void {
    this.formData = this.createQueryForm()
    this.setMonthAndYear(this.formData.getRawValue().date)
    this.stock = this.router.snapshot.paramMap.get('stock')
    this._adapter.setLocale(this._locale);
    this.parallax()
  }

  private createQueryForm(): FormGroup {
    return this.fb.group({
      date: [moment(new Date('2022/07/31')), Validators.required]
    });
  }

  setMonthAndYear(normalizedMonthAndYear?: Moment, datepicker?: MatDatepicker<Moment>) {
    const ctrlValue = this.formData.getRawValue()['date']!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.formData.get('date').setValue(ctrlValue);
    this.title_text = `${normalizedMonthAndYear.year()}年${normalizedMonthAndYear.month()+1}月發文量排行榜`
    if(datepicker) {
      datepicker.close();
    }
  }

  private parallax() {
    let img1 = document.getElementsByClassName("parallax_img")
    new SimpleParallax(img1, {
      scale: 1.8,
      orientation: "down",
      overflow: true,
      delay: .5,
      transition: 'cubic-bezier(0,0,.58,1)'
    })
  }


}

