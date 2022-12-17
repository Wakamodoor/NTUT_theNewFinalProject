import { ChartService } from './../../../helper/services/chart.service';
import { SocketService } from './../../../helper/services/socket.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

interface wordcloudData {
  name: string,
  value: number
}

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.css']
})
export class Home2Component implements OnInit {
  @Input() year: any;
  @Input() month: any;
  @Input() stock: string;
  @Input() queryDate: string;
  @Output() return = new EventEmitter<any>();
  wordcloudOp = {}
  monthDailyEmotionOp = {}

  finishLoading: boolean = false
  finishLoading2: boolean = false


  constructor(
    private socket: SocketService,
    private cs: ChartService
  ) { }

  ngOnInit(): void {
    this.queryMonthWordcloud(this.year, this.month)
    this.queryMonthDailyEmotion(this.year, this.month)
  }

  queryMonthWordcloud(year: string, month: string) {
    this.socket.getMonthWordcloudAPI(year, month, this.stock).subscribe(rel => {
      console.log(rel.response)
      this.finishLoading = true
      const data: any = JSON.parse(JSON.stringify(rel.response))
      let WCData: Array<wordcloudData> = []

      data.forEach(arr => {
        const tmpObj = {
          name: arr[0],
          value: arr[1]
        }
        WCData.push(tmpObj)
      });
      this.wordcloudOp = this.cs.wordCloud(WCData)
    })
  }

  queryMonthDailyEmotion(year: string, month: string) {
    this.socket.getMonthDailyEmotion(year, month, this.stock).subscribe((rel) => {
      const data = JSON.parse(JSON.stringify(rel.response))
      let xData = Object.keys(data).map(ele => ele.replace(/\-/g, '/'));
      let posData = [];
      let negData = [];
      let neuData = [];
      Object.keys(data).forEach(ele => {
        posData.push(data[ele][0])
        negData.push(data[ele][1])
        neuData.push(data[ele][2])
      });
      this.monthDailyEmotionOp = this.cs.monthDailyEmotion(xData, posData, negData, neuData)
      this.finishLoading2 = true
    })
  }

  getTooltipText(idx: number) {
    switch (idx) {
      case 1:
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
    }
    return 'nothing'
  }

  backPrePage() {
    this.return.emit()
  }
}
