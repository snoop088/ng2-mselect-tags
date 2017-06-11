import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class MSelectTagsService {

  private documentRect: ClientRect;
  constructor(private http: Http) { }

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

 
  public getViewportRect(documentRect = this.documentRect): ClientRect {
    // Cache the document bounding rect so that we don't recompute it for multiple calls.
    if (!documentRect) {
      this.cacheViewportGeometry();
      documentRect = this.documentRect;
    }

    // Use the document element's bounding rect rather than the window scroll properties
    // (e.g. pageYOffset, scrollY) due to in issue in Chrome and IE where window scroll
    // properties and client coordinates (boundingClientRect, clientX/Y, etc.) are in different
    // conceptual viewports. Under most circumstances these viewports are equivalent, but they
    // can disagree when the page is pinch-zoomed (on devices that support touch).
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=489206#c4
    // We use the documentElement instead of the body because, by default (without a css reset)
    // browsers typically give the document body an 8px margin, which is not included in
    // getBoundingClientRect().
    const scrollPosition = this.getViewportScrollPosition(documentRect);
    const height = window.innerHeight;
    const width = window.innerWidth;

    return {
      top: scrollPosition.top,
      left: scrollPosition.left,
      bottom: scrollPosition.top + height,
      right: scrollPosition.left + width,
      height,
      width,
    };
  }
  private getViewportScrollPosition(documentRect = this.documentRect) {
    // Cache the document bounding rect so that we don't recompute it for multiple calls.
    if (!documentRect) {
      this.cacheViewportGeometry();
      documentRect = this.documentRect;
    }

    // The top-left-corner of the viewport is determined by the scroll position of the document
    // body, normally just (scrollLeft, scrollTop). However, Chrome and Firefox disagree about
    // whether `document.body` or `document.documentElement` is the scrolled element, so reading
    // `scrollTop` and `scrollLeft` is inconsistent. However, using the bounding rect of
    // `document.documentElement` works consistently, where the `top` and `left` values will
    // equal negative the scroll position.
    const top = -documentRect.top || document.body.scrollTop || window.scrollY ||
      document.documentElement.scrollTop || 0;

    const left = -documentRect.left || document.body.scrollLeft || window.scrollX ||
      document.documentElement.scrollLeft || 0;

    return { top, left };
  }

  /** Caches the latest client rectangle of the document element. */
  private cacheViewportGeometry() {
    this.documentRect = document.documentElement.getBoundingClientRect();
  }
}
