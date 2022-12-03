import { Injectable } from '@angular/core';
import { MatLine } from '@angular/material/core';
import * as echarts from 'echarts';

type EChartsOption = echarts.EChartsOption;

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  // 發文量x平均月收盤價
  Chart1(xData: Array<string>, yData: object) {
    let options: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        right: '8%'
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

  // 文字雲
  wordCloud(data: Array<wordcloudData>, maskImage?) {
    // console.log(data)
    return {
      tooltip: {
        show: true,
        trigger: 'item',
        axisPointer: {
          show: true,
          type: 'cross',
          snap: true
        },

      },
      series: [{
          type: 'wordCloud',

          // The shape of the "cloud" to draw. Can be any polar equation represented as a
          // callback function, or a keyword present. Available presents are circle (default),
          // cardioid (apple or heart shape curve, the most known polar equation), diamond (
          // alias of square), triangle-forward, triangle, (alias of triangle-upright, pentagon, and star.

          shape: 'circle',

          // A silhouette image which the white area will be excluded from drawing texts.
          // The shape option will continue to apply as the shape of the cloud to grow.

          // Keep aspect ratio of maskImage or 1:1 for shapes
          // This option is supported from echarts-wordcloud@2.1.0
          keepAspect: false,


          // A silhouette image which the white area will be excluded from drawing texts.
          // The shape option will continue to apply as the shape of the cloud to grow.
          // maskImage: false,

          // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
          // Default to be put in the center and has 75% x 80% size.

          left: 'center',
          top: 'center',
          width: '90%',
          height: '90%',
          right: null,
          bottom: null,

          // Text size range which the value in data will be mapped to.
          // Default to have minimum 12px and maximum 60px size.

          sizeRange: [20, 80],

          // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45

          rotationRange: [0, 0],
          rotationStep: 0,

          // size of the grid in pixels for marking the availability of the canvas
          // the larger the grid size, the bigger the gap between words.

          gridSize: 12,

          // set to true to allow word being draw partly outside of the canvas.
          // Allow word bigger than the size of the canvas to be drawn
          drawOutOfBound: false,

          // If perform layout animation.
          // NOTE disable it will lead to UI blocking when there is lots of words.
          layoutAnimation: true,

          // Global text style
          textStyle: {
              fontFamily: 'sans-serif',
              fontWeight: 'bold',
              // Color can be a callback function or a color string
              color: () => {
                return 'rgb('+[
                  244 + Math.round(Math.random() * 10),
                  187 + Math.round(Math.random() * 50),
                  14 + Math.round(Math.random() * 200)
                ]
              }
              // color: function () {
              //     // Random color
              //     return 'rgb(' + [
              //         Math.round(Math.random() * 160),
              //         Math.round(Math.random() * 160),
              //         Math.round(Math.random() * 160)
              //     ].join(',') + ')';
              // }
          },
          emphasis: {
              focus: 'self',

              textStyle: {
                  shadowBlur: 25,
                  shadowColor: '#fff'
              }
          },

          // Data is an array. Each array item must have name and value property.
          data: data
      }]
    };
  }

  dailyPost(xData: Array<string>, yData: Array<number>) {

    let options: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        right: '8%'
      },
      legend: {
        data: ['每日發文量', '日期']
      },
      xAxis: {
        type: 'category',
        data: [...xData]
      },
      yAxis: {
        type: 'value',
          name: '每日發文量',
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#9E3326'
            }
          }
      },
      series: [
        {
          data: [...yData],
          name: '每日發文量',
          type: 'line',
          smooth: true,
          color: '#9E3326'
        }
        ]
      };
    return options
  }
}

interface wordcloudData {
      name: string,
      value: number
}
