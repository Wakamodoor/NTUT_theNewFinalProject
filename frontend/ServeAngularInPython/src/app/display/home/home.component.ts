import { SocketService } from '../../helper/services/socket.service';
import { ChartService } from '../../helper/services/chart.service';
import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { TitleStrategy } from '@angular/router';
import { map } from 'rxjs';

type EChartsOption = echarts.EChartsOption;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  chartDom = document.getElementById('linechart')!;

  chartData: any

  options: Array<EChartsOption> = []

  constructor(
    private cs: ChartService,
    private socket: SocketService
  ) { }

  ngOnInit(): void {
    this.getAPITest()
  }

  getAPITest() {
    this.socket.getAPI('chart_1', '阿土伯').pipe(
      map(arr => {
        let newArr: any = arr.response
        newArr.forEach((ele: Array<string>) => {
          ele.push(`${ele[0]}/${ele[1]}`)
        });
        return newArr
      }
      )
    ).subscribe(rel => {
      this.chr1DataTran(rel)
    })
  }

  chr1DataTran(rel: any) {
    let xData: Array<string> = []
    rel.map((arr: Array<string>) => xData.push(arr[4]))

    let yData: Array<any> = []
    let postNum: Array<string> = []

    rel.map((arr: Array<string>) => {
      yData.push(arr[3])
    })
    // yData.push(postNum)

    this.options.push(this.cs.Chart1(xData, yData))
  }

}

