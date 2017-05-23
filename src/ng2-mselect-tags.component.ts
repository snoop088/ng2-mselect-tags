import { Component, forwardRef, Input, OnInit, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'ng2-mselect-tags',
  template: `
  <div class="input-field">
    <input type="text" name="search" [formControl]="search" (blur)="onInputBlur()" placeholder="Enter team name">
  </div>
  <div class="dropdown z-depth-1" [style.maxHeight.px]="calculateHeight()">
    <ul>
      <li *ngFor="let item of items" (click)="add($event, item)">{{item[listBy]}}
        <i class="material-icons">add</i>
      </li>
    </ul>
  </div>
  <div class="collect" [style.height.em]="maxSelectHeight">
    <ul *ngIf="selected">
      <li *ngFor="let selItem of selected" (click)="remove($event, selItem)" [class.disabled]="isDisabled">{{selItem[listBy]}}
        <div class="del"><i class="material-icons">clear</i></div>
      </li>
    </ul>
  </div>`,
  styleUrls: ['ng2-mselect-tags.component.css'],
  providers: [PARAM_TAGS_CONTROL_VALUE_ACCESSOR]
})
export class MSelectTagsComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() minChars = 0;
  @Input() list: {}[] = [];
  @Input() searchUrl: string; // of the type https://api.spotify.com/v1/search?type=artist&limit=25&q=[keyword]
  @Input() accessBy = 'items'; // key which to use for accessing found results
  @Input() listBy = 'name'; // property which to use for listing the results
  @Input() maxPanelHeight: number;
  @Input() maxContainerRows = 2;

  public items: {}[] = [];
  public search: FormControl;
  public selected: {}[] = [];
  
  public isDisabled: boolean;

  private itemsSubscription: Subscription;
  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  constructor(private multiService: MSelectTagsService) {
    this.search = new FormControl();
  }

  ngOnInit() {
    if (this.list.length > 0) {
      this.items = this.list;
    } else {

      this.itemsSubscription = this.search.valueChanges
        .debounceTime(300)
        .distinctUntilChanged()
        .filter(str => { 
          if (str === null) { return false }
          return str.length > this.minChars || str.length === 0; })
        .switchMap(searchTerm => {
          if (searchTerm.length === 0) {
            return Observable.of(null);
          }
          return this.multiService.getAsyncOptions(this.searchUrl, searchTerm, this.accessBy);
        })
        .subscribe(result => {
          this.items = result;
          console.log(this.items);
        });
    }
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
    return this.maxContainerRows * 1.5;
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
  public calculateHeight(): string | number {
    return this.maxPanelHeight ? this.maxPanelHeight : 'auto';
  }
  private add($event, item: {}) {
    if (this.selected.map(selItem => selItem[this.listBy])
      .indexOf(item[this.listBy]) === -1) {
        this.value = [...this.selected, item];
      }
    // if (this.selected.indexOf(item) === -1){ // Item hasn't been selected
    //   this.selected = [...this.selected, item];
    // }
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

}
