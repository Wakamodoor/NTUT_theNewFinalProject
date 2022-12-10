import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ajax } from 'rxjs/ajax';
import { catchError, pipe, map } from 'rxjs';

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

   /** GET: 文字雲詞與詞頻
    * @param author 作者名稱
    * @param startDate 起始日期
    * @param endDate 終止日期
    * @param stock? 股票名稱 foxconn | evergreen
  */
  getWordcloudAPI(author: string, startDate: string, endDate: string, stock?: string) {
    // stock: string = 'evergreen'
    console.log(`http://localhost:5000/evergreen/wordcloud/${author}?starttime=${startDate}&endtime=${endDate}`)
    return ajax({
      url: `http://localhost:5000/evergreen/wordcloud/${author}?starttime=${startDate}&endtime=${endDate}`,
      method: 'GET',
      responseType: 'json'
    })
  }

  getKOLRankAPI(year: string, month: string) {
    console.log(`http://localhost:5000/evergreen/ranking?year=${year}&month=${month}`)
    return ajax({
      url:`http://localhost:5000/evergreen/ranking?year=${year}&month=${month}`,
      method: 'GET',
      responseType: 'json'
    })
  }

  getMonthWordcloudAPI(year: string, month: string) {
    return ajax({
      url:`http://localhost:5000/evegreen/monthlywordcloud?year=${year}&month=${month}`,
      method: 'GET',
      responseType: 'json'
    })
  }

  getDailyPostAPI(author: string, year: string, month: string) {
    return ajax({
      url:`http://localhost:5000/evegreen/dailypost/${author}?year=${year}&month=${month}`,
      method: 'GET',
      responseType: 'json'
    })
  }

  getBertAPI(content: string) {
    return ajax({
      url:`http://localhost:5000/predict`,
      method: 'POST',
      responseType: 'json',
      body: {
        "article": content
      }
    })
  }

  getDailyPriceAPI(year: string, month: string) {
    return ajax({
      url: `http://localhost:5000/evergreen/dailyprice?year=${year}&month=${month}`,
      method: 'GET',
      responseType: 'json'
    }).pipe(
      map(rel => {
        const data = JSON.parse(JSON.stringify(rel.response))
        let newData = []
        data.forEach(obj => {
          newData.push({
            "DATE(DATETIME)": obj['DATE(DATETIME)'].replaceAll('-', '/'),
            "endprice": obj['endprice']
          })
        });
        return newData
      })
    )
  }
}
