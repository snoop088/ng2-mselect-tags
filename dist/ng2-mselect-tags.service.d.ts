import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
export declare class MSelectTagsService {
    private http;
    private documentRect;
    constructor(http: Http);
    getAsyncOptions(url: string, keyword: string, accessBy: string): Observable<{}[]>;
    getSyncOptions(list: {}[], keyword: string, listBy: string): Observable<{}[]>;
    getViewportRect(documentRect?: ClientRect): ClientRect;
    private getViewportScrollPosition(documentRect?);
    /** Caches the latest client rectangle of the document element. */
    private cacheViewportGeometry();
    private composeUrl(url, keyword);
}
