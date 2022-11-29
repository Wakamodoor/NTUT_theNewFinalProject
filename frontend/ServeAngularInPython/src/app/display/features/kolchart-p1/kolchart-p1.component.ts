import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../../helper/services/socket.service';
import { ChartService } from '../../../helper/services/chart.service';
import * as echarts from 'echarts';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
import { concatMap, filter, forkJoin, map, range } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'app-kolchart-p1',
  templateUrl: './kolchart-p1.component.html',
  styleUrls: ['./kolchart-p1.component.css']
})
export class KolchartP1Component implements OnInit {

  formData: FormGroup

  everGreenKOL = ['阿土伯', 'E神']
  // chartDom = document.getElementById('linechart')!;

  chartData: any

  options: EChartsOption = {}

  constructor(
    private cs: ChartService,
    private socket: SocketService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formData = this.createQueryForm()
    this.chr1DataBuild(this.formData.getRawValue().author)
    console.log(this.route.snapshot.paramMap)
  }

  chr1DataBuild(author: any) {
    // const author = this.formData.getRawValue().autohor
    // console.log(author)
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
    console.log($event.name)
    this.router.navigate(['kolchart2'], {
      queryParams: {
        date: $event.name,
        fromKOL: true
      }
    })
  }

  private createQueryForm(): FormGroup {
    return this.fb.group({
      author: ['阿土伯']
    });
  }
}
