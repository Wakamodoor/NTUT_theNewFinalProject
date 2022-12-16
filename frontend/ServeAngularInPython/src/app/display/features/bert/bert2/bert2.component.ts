import { SocketService } from './../../../../helper/services/socket.service';
import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-bert2',
  templateUrl: './bert2.component.html',
  styleUrls: ['./bert2.component.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'zh-tw'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class Bert2Component implements OnInit {
  @Input() stock: string;
  @Output() return = new EventEmitter<any>()

  filteredOptions: Observable<string[]>;
  authorList = ['阿土伯', 'E神', '趨勢King', '小曼姐姐', '中華英雄', 'kenviwang', '趨勢再走 勇氣要有(空軍司令)']
  option: string = ''
  queryForm: FormGroup;

  result: string = ''
  analyst: string = ''
  investors: string = ''
  robot: string = ''

  constructor(
    private fb: FormBuilder,
    private socket: SocketService,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) { }

  ngOnInit(): void {
    this.queryForm = this.createForm()

    this.filteredOptions = this.queryForm.controls['author'].valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value || '')),
    );
  }

  queryBert2() {
    const _result = document.querySelector('.result')
    const _loading = document.querySelector('.loading')
    _loading.setAttribute('style', 'opacity: 1;')
    _result.setAttribute('style', 'opacity: 0;')

    const year = this.queryForm.get('date').value.year()
    let month = this.queryForm.get('date').value.month()+1
    const day = this.queryForm.get('date').value.date()
    if(month.toString().length === 1) {
      month = '0' + month.toString()
    }
    console.log(month)
    const date = `${year}-${month}-${day}`
    this.socket.getAuthorADayBert(this.queryForm.get('author').value, date, this.stock).subscribe((rel) => {
      const data = JSON.parse(JSON.stringify((rel.response)))
      this.result = data['發文者類型']
      this.analyst = data['分析師文章數']
      this.investors = data['散戶文章數']
      this.robot = data['機器人文章數']

      _loading.setAttribute('style', 'opacity: 0;')
      _result.setAttribute('style', 'opacity: 1;')
    })
  }

  backPrePage() {
    this.return.emit()
  }

  getTooltipText() {
    return `
    此功能可以選擇作者，以及特定日期，按下預測後，
    會得到該作者當天的發文有哪些屬於分析師、機器人和散戶。
    －－－－－－－－－－－－－－－－－－－－－－－－－－－－
    散戶：多帶有主觀情緒，以及網路用語。
    機器人：常為轉發新聞的作者，或有固定發文格式。
    分析師：較理性分析個股或大盤情況，並給予許多有用資訊。
    `
  }

  private createForm(): FormGroup {
    return this.fb.group({
      author: ['', Validators.required],
      date: [{value: '', disabled: true}, Validators.required],
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.authorList.filter(option => option.toLowerCase().includes(filterValue));
  }

}

