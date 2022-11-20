import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ajax } from 'rxjs/ajax';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  testData: Array<object> = []
  constructor(
    private http: HttpClient,
  ) {}

  /** GET: 發文者月發文量
   * @param chrNum 第幾種圖表, ex:chart_1
   * @param who 哪位作者, ex:阿土伯
  */
  getAPI(chrNum: string, who: string, stock: string = 'evergreen') {
    return ajax({
      url: `http://localhost:5000//${stock}/${chrNum}/${who}`,
      method: 'GET',
      responseType: 'json'
    })
  }

  /** GET: 月成交量&平均收盤價
  */
  getCommonAPI() {
    return ajax({
      url: 'http://localhost:5000/chart_evergreen',
      method: 'GET',
      responseType: 'json'
    })
  }

  getWordcloudAPI() {
    // stock: string = 'evergreen'
    return ajax({
      url: 'http://localhost:5000/evergreen/wordcloud/E神?starttime=2021-01-01&endtime=2021-7-31',
      method: 'GET',
      responseType: 'json'
    })
  }

}
