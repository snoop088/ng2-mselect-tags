import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

@Injectable()
export class MSelectTagsService {

  constructor(private http: Http) {}
  
  public getAsyncOptions(url: string, keyword: string, accessBy: string): Observable<{}[]> { 
    if (url !== undefined) {
      const composedUrl = this.composeUrl(url, keyword);
      return this.http.get(composedUrl)
        .map(response => {
          return accessBy.split('.').reduce((accu, accessor) => accu[accessor], response.json());
        });
    } else {
      return Observable.of(null);
    }
  }
  public getSyncOptions(list: {}[], keyword: string, listBy: string): Observable<{}[]> {
    return Observable.of(
      list.filter(item => {
        return item[listBy].indexOf(keyword) > -1;
      })
    );
  }
  // taken from Angular Material 2
  
  private composeUrl(url: string, keyword: string): string {
      let composedUrl = '';
      if (url.indexOf('[keyword]') !== -1) {
        composedUrl = url
          .replace('[keyword]', keyword);
          return composedUrl;
      } else {
        throw new Error('Missing [keyword] token in URL');
      }
    }
}
