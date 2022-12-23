import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { filter, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild("btn", { static: false }) eleList: ElementRef;


  prevScrollpos = window.pageYOffset;

  ifChoose: boolean = false
  stock: string
  stockName: string

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    (this.router.events.pipe(filter(event => event instanceof ActivationEnd)) as Observable<ActivationEnd>).subscribe(router => {
      if(router.snapshot.component.name === 'ChooseComponent') {
        this.ifChoose = false
        document.getElementById('funBtn').style.display = 'none';
      }else {
        this. stock = router.snapshot.params['stock']
        this.ifChoose = true
        this.stockName = this.stock === '2603'? '2603長榮' : '2317鴻海'
        document.getElementById('funBtn').style.display = 'flex';
      }
      switch(router.snapshot.component.name) {
        case 'HomeComponent': {
          for(const j of this.eleList.nativeElement.querySelectorAll('.function')) {
            j.classList.remove('clicked')
          }
          break;
        }
        case 'StkpostchartComponent': {
          document.getElementById('kolchart1').classList.add('clicked')
          break;
        }
        case 'WordcloudComponent': {
          document.getElementById('wordcloud').classList.add('clicked')
          break;
        }
        case 'BertComponent': {
          document.getElementById('predict').classList.add('clicked')
          break;
        }
      }
    })


  }

  ngAfterViewInit(): void {
    this.activedWatching()
  }

  activedWatching() {
    for(const ele of this.eleList.nativeElement.querySelectorAll('.function')) {
      ele.addEventListener('click', () => {
        for(const j of this.eleList.nativeElement.querySelectorAll('.function')) {
          j.classList.remove('clicked')
        }
        ele.classList.add('clicked')
      })
    }
  }




}
