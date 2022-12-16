import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from './../../../helper/services/socket.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bert',
  templateUrl: './bert.component.html',
  styleUrls: ['./bert.component.css']
})
export class BertComponent implements OnInit {

  result: string

  stock: string

  isBert2: boolean = false;



  constructor(
    private socket: SocketService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.stock = this.route.snapshot.paramMap.get('stock')

  }

  queryPredict(content: string) {
    const _result = document.querySelector('.result')
    const _loading = document.querySelector('.loading')
    _loading.setAttribute('style', 'opacity: 1;')
    _result.setAttribute('style', 'opacity: 0;')

    this.socket.getBertAPI(content).subscribe(rel => {
      this.result = JSON.parse(JSON.stringify(rel.response['發文者類型']))
      _loading.setAttribute('style', 'opacity: 0;')
      _result.setAttribute('style', 'opacity: 1;')
    })
  }

  backPrePage() {
    this.router.navigateByUrl(`home/${this.stock}`)
  }

  returnPage() {
    this.isBert2 = false;
  }

  goBert2Page() {
    this.isBert2 = true;
  }

  getTooltipText(idx: number) {
    switch (idx) {
      case 1:
        return `
        可在左方輸入框中放入句子或文章，按下預測按鈕後，
        等待一段時間會出現三種結果，分別是散戶/機器人/分析師，
        －－－－－－－－－－－－－－－－－－－－－－－－－－－－
        散戶：多帶有主觀情緒，以及網路用語。
        機器人：常為轉發新聞的作者，或有固定發文格式。
        分析師：較理性分析個股或大盤情況，並給予許多有用資訊。
        `
    }
    return 'nothing'
  }

}
