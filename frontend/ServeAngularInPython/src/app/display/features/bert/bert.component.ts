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

}
