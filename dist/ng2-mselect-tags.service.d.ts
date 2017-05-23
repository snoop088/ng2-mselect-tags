import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
export declare class MSelectTagsService {
    private http;
    constructor(http: Http);
    getAsyncOptions(url: string, keyword: string, accessBy: string): Observable<{}[]>;
    private composeUrl(url, keyword);
}
