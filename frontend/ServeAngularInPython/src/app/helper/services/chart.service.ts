import { Injectable } from '@angular/core';
import * as echarts from 'echarts';

type EChartsOption = echarts.EChartsOption;

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  Chart1(xData: Array<string>, yData: object) {
    let options: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['月發文量', '平均月收盤價']
      },
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis:[
        {
          type: 'value',
          name: '月發文量',
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
          name: '平均月收盤價',
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
          data: yData['volOfMonth'],
          name: '月發文量',
          type: 'line',
          yAxisIndex: 1,
          smooth: true
        },
        {
          data: yData['avgClose'],
          name: '平均月收盤價',
          type: 'bar',
        }
      ]
    };
    return options
  }
}
