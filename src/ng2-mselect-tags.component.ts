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
  @Input() maxPanelHeight: number;
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
    let positionTop = new Promise ((resolve, reject) => {
      const defSearchPanelHeight: number = this.searchPanelHeight === 'auto' ? null : parseInt(this.searchPanelHeight as string);
      const searchPanelOptionsHeight = this.checkItems() ? this.items.length * SELECT_OPTION_HEIGHT : 0;
      const viewPortRect = this.multiService.getViewportRect();
      const searchPanelRect = this.getSearchPanelRect();
      const dropdownHeight = Math.min(searchPanelOptionsHeight, defSearchPanelHeight || searchPanelOptionsHeight);
      console.log(`total height: ${viewPortRect.height}, panel top: ${searchPanelRect.top}, dropdown height: ${dropdownHeight}`);
      if ((viewPortRect.height - searchPanelRect.top - dropdownHeight < 0) &&
        (viewPortRect.top + searchPanelRect.top - dropdownHeight > 0)) {
          setTimeout(() => resolve(true), 0);
      } else {
        setTimeout(() => resolve(false), 0);
      }
    });
    return positionTop;
    // console.log(viewPortRect);
    // console.log(viewPortRect.height - dropdownRect.bottom);
    
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

}
