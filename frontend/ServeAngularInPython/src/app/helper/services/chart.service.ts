import { Injectable } from '@angular/core';
import * as echarts from 'echarts';

type EChartsOption = echarts.EChartsOption;

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  Chart1(xData: Array<string>, yData: Array<string>) {
    let options: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['成交量', '股價']
      },
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis:[
        {
          type: 'value',
          name: '成交量',
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ff0000'
            }
          }
        },
        {
          type: 'value',
          name: '股價',
          position: 'right',
          axisLine: {
            show: true
          },
          axisLabel: {
            formatter: '{value} 元'
          }
        }
      ]
      ,
      series: [
        {
          data: yData,
          name: '成交量',
          type: 'line',
          yAxisIndex: 1,
          smooth: true
        },
        {
          data: [820, 932, 901, 934, 1290, 1330, 200, 500, 256, 1280, 579, 847],
          name: '股價',
          type: 'bar',
        }
      ]
    };
    return options
  }
}
