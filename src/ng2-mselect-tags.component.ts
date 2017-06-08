import { Component, forwardRef, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { MSelectTagsService } from './ng2-mselect-tags.service';

export const PARAM_TAGS_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MSelectTagsComponent),
  multi: true
};
/** The fixed height of every option element. */
export const SELECT_OPTION_HEIGHT = 32;

@Component({
  selector: 'ng2-mselect-tags',
  templateUrl: 'ng2-mselect-tags.component.html',
  styleUrls: ['ng2-mselect-tags.component.css'],
  providers: [PARAM_TAGS_CONTROL_VALUE_ACCESSOR]
})
export class MSelectTagsComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() minChars = 0;
  @Input() placeholder: string; // the placeholder for the input field
  @Input() list: {}[] = [];
  @Input() searchUrl: string; // of the type https://api.spotify.com/v1/search?type=artist&limit=25&q=[keyword]
  @Input() accessBy = 'items'; // key which to use for accessing found results
  @Input() listBy = 'name'; // property which to use for listing the results
  @Input() maxPanelHeight: number; // max search result panel height in pixels
  @Input() maxContainerRows = 2; // under review: this should specify how many rows of tags to show before scroll
  @ViewChild('dropdown') public dropdown: ElementRef;
  @ViewChild('searchPanel') public searchPanel: ElementRef;
  public items: {}[] = [];
  public search: FormControl;
  public selected: {}[] = [];
  public selectOptionsHeight;


  public isDisabled: boolean;
  public isTop = false;
  public isShown = false;

  private itemsSubscription: Subscription;
  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };
  private documentRect: ClientRect;


  constructor(private multiService: MSelectTagsService) {
    this.search = new FormControl();
    this.selectOptionsHeight = SELECT_OPTION_HEIGHT;
  }

  ngOnInit() {
    this.itemsSubscription = this.search.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .filter(str => {
        if (str === null) { return false; }
        return str.length > this.minChars || str.length === 0;
      })
      .switchMap(searchTerm => {
        if (searchTerm.length === 0) {
          return Observable.of(null);
        }
        if (this.list.length > 0) {
          return this.multiService.getSyncOptions(this.list, searchTerm, this.listBy);
        }
        return this.multiService.getAsyncOptions(this.searchUrl, searchTerm, this.accessBy);
      })
      .subscribe(result => {
        this.items = result;
        this.checkOverlayPosition().then(isTopResult => {
          this.isTop = isTopResult;
          if (this.checkItems()) {
            this.isShown = true;
          } else {
            this.isShown = false;
          }
        });
      });
  }
  ngOnDestroy() {
    this.itemsSubscription.unsubscribe();
  }
  // Implement the Control Value Accessor interface
  get value(): any {
    return this.selected;
  };
  set value(v: any) {
    if (v && v !== this.selected) {
      this.selected = v;
      this.onChangeCallback(v);
    }
  }
  get maxSelectHeight(): number {
    return 0.5 + 1.5 * this.maxContainerRows + 0.25 * (this.maxContainerRows - 1);
  }
  get searchPanelHeight(): string | number {
    return this.maxPanelHeight ? this.maxPanelHeight : 'auto';
  }
  onBlur() {
    this.onTouchedCallback();
  }
  writeValue(value: any) {
    if (value && value !== this.selected) {
      this.selected = value;
    }
  }
  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  setDisabledState(isDisabled: boolean) {
    // disable other components here
    if (isDisabled) {
      this.search.disable();
      this.isDisabled = true;
    } else {
      this.search.enable();
      this.isDisabled = false;
    }
  }
  public onInputBlur() {
    this.search.setValue('');
  }
  public checkItems(): boolean {
    return this.items && this.items.length > 0;
  }
  public checkOverlayPosition(): Promise<boolean> {
    let positionTop = new Promise((resolve, reject) => {
      const defSearchPanelHeight: number = this.searchPanelHeight === 'auto' ? null : parseInt(this.searchPanelHeight as string);
      const searchPanelOptionsHeight = this.checkItems() ? this.items.length * SELECT_OPTION_HEIGHT : 0;
      const viewPortRect = this.getViewportRect();
      const searchPanelRect = this.getSearchPanelRect();
      const dropdownHeight = Math.min(searchPanelOptionsHeight, defSearchPanelHeight || searchPanelOptionsHeight);
      if ((viewPortRect.height - searchPanelRect.top - dropdownHeight < 0) &&
        (viewPortRect.top + searchPanelRect.top - dropdownHeight > 0)) {
        setTimeout(() => resolve(true), 0);
      } else {
        setTimeout(() => resolve(false), 0);
      }
    });
    return positionTop;
  }

  private add($event, item: {}) {
    if (this.selected.map(selItem => selItem[this.listBy])
      .indexOf(item[this.listBy]) === -1) {
      this.value = [...this.selected, item];
    }
  }
  private remove($event, item: {}) {
    const index =
      this.selected.map(selItem => selItem[this.listBy])
        .indexOf(item[this.listBy]);
    if (index !== -1) {
      this.selected.splice(index, 1);
      this.value = this.selected;
    }
  }
  private getSearchPanelRect(): ClientRect {
    return this.searchPanel.nativeElement.getBoundingClientRect();
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
