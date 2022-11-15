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

  /** sendreq
   * @param chrNum 第幾種圖表, ex:chart_1
   * @param who 哪位作者, ex:阿土伯
  */
  getAPI(chrNum: string, who: string) {
    return ajax({
      url: `http://localhost:5000/${chrNum}/${who}`,
      method: 'GET',
      responseType: 'json'
    })
  }
}
