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
              color: '#4C9E75'
            }
          }
        },
        {
          type: 'value',
          name: '平均月收盤價',
          position: 'right',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#9E3326'
            }
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
          type: 'bar',
          yAxisIndex: 1,
          color: "#4C9E75"
        },
        {
          data: yData['avgClose'],
          name: '平均月收盤價',
          type: 'line',
          smooth: true,
          color: '#9E3326'
        }
      ]
    };
    return options
  }
}
