import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { filter, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  prevScrollpos = window.pageYOffset;

  ifChoose: boolean = false
  stock: string

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    (this.router.events.pipe(filter(event => event instanceof ActivationEnd)) as Observable<ActivationEnd>).subscribe(router => {
      if(router.snapshot.component.name === 'ChooseComponent') {
        this.ifChoose = false
      }else {
        this. stock = router.snapshot.params['stock']
        this.ifChoose = true
        // this.stock = this.route.snapshot.queryParams
      }
    })
  }




}
