import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../../helper/services/socket.service';
import { ChartService } from '../../../helper/services/chart.service';
import * as echarts from 'echarts';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
import { concatMap, filter, forkJoin, map, Observable, range, startWith } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common'

type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'app-stkpostchart',
  templateUrl: './stkpostchart.component.html',
  styleUrls: ['./stkpostchart.component.css']
})
export class StkpostchartComponent implements OnInit {


  fromKOL: boolean

  formData: FormGroup

  everGreenKOL = ['阿土伯', 'E神']
  // chartDom = document.getElementById('linechart')!;

  chartData: any

  options: EChartsOption = {}

  stock: string
  author: string
  queryDate: string

  filteredOptions: Observable<string[]>;

  authorList = ['阿土伯', 'E神']


  constructor(
    private cs: ChartService,
    private socket: SocketService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.formData = this.createQueryForm()
    this.stock = this.route.snapshot.paramMap.get('stock')
    this.chr1DataBuild(this.formData.getRawValue()['author'])

    this.filteredOptions = this.formData.controls['author'].valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '')),
    );
  }

  chr1DataBuild(author: any) {
    // const author = this.formData.getRawValue().autohor
    // console.log(author)
    this.author = author
    this.socket.getAPI('chart_1', author).pipe(
      map(arr => {
        let newArr: any = arr.response
        newArr.forEach((obj: object) => {
          obj['yearMonth'] = `${obj['year']}/${obj['month']}`
        });
        return newArr
      }),
    ).subscribe(rel => {
      // console.log(rel)
      let xData: Array<string> = []
      let yData: object = {
        "volOfMonth": [],
        "avgClose": []
      }
      rel.map((obj: object) => {
        xData.push(obj['yearMonth']),
        yData['volOfMonth'].push(obj['volOfMonth'])
      })
      this.socket.getCommonAPI().pipe(map(arr2 => {
        let newArr2: any = arr2.response
        newArr2.forEach((obj: object) => {
          obj['yearMonth'] = `${obj['year']}/${obj['month']}`
        });
        return newArr2
      })
      ).subscribe(rel2 => {
        rel2.forEach(ele => {
          if(xData.includes(ele['yearMonth'])) {
            yData['avgClose'].push(Math.round(ele['avgClose']*100)/100)
          }
        })
        this.options = this.cs.Chart1(xData, yData)
      })
    })
  }

  sendBarClick($event) {
    const queryDate = ($event.name).replace('/', '年') + '月'
    console.log(queryDate)
    this.router.navigateByUrl(`home/${this.stock}/${this.author}/${queryDate}/kolchart2`)
  }

  backPrePage() {
    this.router.navigateByUrl(`home/${this.stock}`)
  }

  private createQueryForm(): FormGroup {
    return this.fb.group({
      author: ['阿土伯']
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.authorList.filter(option => option.toLowerCase().includes(filterValue));
  }

  getTooltipText(idx: number) {
    switch (idx) {
      case 1:
        return `
        可直接輸入作者名稱，或是以選單方式選擇
        熱門KOL，來查詢作者有發文以來，每個月
        的發文量與該月之平均收盤價關係圖。
        `
    }
    return 'nothing'
  }

}
