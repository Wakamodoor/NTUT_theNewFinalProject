import { ChartService } from './../../../helper/services/chart.service';
import { SocketService } from './../../../helper/services/socket.service';
import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts'
import 'echarts-wordcloud';
import { UrlHandlingStrategy } from '@angular/router';

interface wordcloudData {
  name: string,
  value: number
}


@Component({
  selector: 'app-kolchart-p2',
  templateUrl: './kolchart-p2.component.html',
  styleUrls: ['./kolchart-p2.component.css']
})
export class KolchartP2Component implements OnInit {

  maskImage  = new Image();
  wordcloudOp = {}

  constructor(
    private socket: SocketService,
    private cs: ChartService
  ) { }

  ngOnInit(): void {
    this.maskImage.src = '../../../../assets/image/silhouette_cloud.png'
    this.buildWordCloud()
  }

  buildWordCloud() {
    this.socket.getWordcloudAPI().subscribe(rel => {
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
