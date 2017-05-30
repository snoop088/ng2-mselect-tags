import { Component, Injectable, Input, NgModule, ViewChild, forwardRef } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Http } from '@angular/http';
import 'rxjs/add/operator/mergeMap';

var MSelectTagsService = (function () {
    /**
     * @param {?} http
     */
    function MSelectTagsService(http) {
        this.http = http;
    }
    /**
     * @param {?} url
     * @param {?} keyword
     * @param {?} accessBy
     * @return {?}
     */
    MSelectTagsService.prototype.getAsyncOptions = function (url, keyword, accessBy) {
        if (url !== undefined) {
            var /** @type {?} */ composedUrl = this.composeUrl(url, keyword);
            return this.http.get(composedUrl)
                .map(function (response) {
                return accessBy.split('.').reduce(function (accu, accessor) { return accu[accessor]; }, response.json());
            });
        }
        else {
            return Observable.of(null);
        }
    };
    /**
     * @param {?} list
     * @param {?} keyword
     * @param {?} listBy
     * @return {?}
     */
    MSelectTagsService.prototype.getSyncOptions = function (list, keyword, listBy) {
        return Observable.of(list.filter(function (item) {
            return item[listBy].indexOf(keyword) > -1;
        }));
    };
    /**
     * @param {?=} documentRect
     * @return {?}
     */
    MSelectTagsService.prototype.getViewportRect = function (documentRect) {
        if (documentRect === void 0) { documentRect = this.documentRect; }
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
        var /** @type {?} */ scrollPosition = this.getViewportScrollPosition(documentRect);
        var /** @type {?} */ height = window.innerHeight;
        var /** @type {?} */ width = window.innerWidth;
        return {
            top: scrollPosition.top,
            left: scrollPosition.left,
            bottom: scrollPosition.top + height,
            right: scrollPosition.left + width,
            height: height,
            width: width,
        };
    };
    /**
     * @param {?=} documentRect
     * @return {?}
     */
    MSelectTagsService.prototype.getViewportScrollPosition = function (documentRect) {
        if (documentRect === void 0) { documentRect = this.documentRect; }
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
        var /** @type {?} */ top = -documentRect.top || document.body.scrollTop || window.scrollY ||
            document.documentElement.scrollTop || 0;
        var /** @type {?} */ left = -documentRect.left || document.body.scrollLeft || window.scrollX ||
            document.documentElement.scrollLeft || 0;
        return { top: top, left: left };
    };
    /**
     * Caches the latest client rectangle of the document element.
     * @return {?}
     */
    MSelectTagsService.prototype.cacheViewportGeometry = function () {
        this.documentRect = document.documentElement.getBoundingClientRect();
    };
    /**
     * @param {?} url
     * @param {?} keyword
     * @return {?}
     */
    MSelectTagsService.prototype.composeUrl = function (url, keyword) {
        var /** @type {?} */ composedUrl = '';
        if (url.indexOf('[keyword]') !== -1) {
            composedUrl = url
                .replace('[keyword]', keyword);
            return composedUrl;
        }
        else {
            throw new Error('Missing [keyword] token in URL');
        }
    };
    return MSelectTagsService;
}());
MSelectTagsService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
MSelectTagsService.ctorParameters = function () { return [
    { type: Http, },
]; };

var PARAM_TAGS_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MSelectTagsComponent; }),
    multi: true
};
/**
 * The fixed height of every option element.
 */
var SELECT_OPTION_HEIGHT = 32;
var MSelectTagsComponent = (function () {
    /**
     * @param {?} multiService
     */
    function MSelectTagsComponent(multiService) {
        this.multiService = multiService;
        this.minChars = 0;
        this.list = [];
        this.accessBy = 'items'; // key which to use for accessing found results
        this.listBy = 'name'; // property which to use for listing the results
        this.maxContainerRows = 2;
        this.items = [];
        this.selected = [];
        this.isTop = false;
        this.isShown = false;
        this.onTouchedCallback = function () { };
        this.onChangeCallback = function () { };
        this.search = new FormControl();
        this.selectOptionsHeight = SELECT_OPTION_HEIGHT;
    }
    /**
     * @return {?}
     */
    MSelectTagsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.itemsSubscription = this.search.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .filter(function (str) {
            if (str === null) {
                return false;
            }
            return str.length > _this.minChars || str.length === 0;
        })
            .switchMap(function (searchTerm) {
            if (searchTerm.length === 0) {
                return Observable.of(null);
            }
            if (_this.list.length > 0) {
                return _this.multiService.getSyncOptions(_this.list, searchTerm, _this.listBy);
            }
            return _this.multiService.getAsyncOptions(_this.searchUrl, searchTerm, _this.accessBy);
        })
            .subscribe(function (result) {
            _this.items = result;
            _this.checkOverlayPosition().then(function (isTopResult) {
                _this.isTop = isTopResult;
                if (_this.checkItems()) {
                    _this.isShown = true;
                }
                else {
                    _this.isShown = false;
                }
            });
        });
    };
    /**
     * @return {?}
     */
    MSelectTagsComponent.prototype.ngOnDestroy = function () {
        this.itemsSubscription.unsubscribe();
    };
    Object.defineProperty(MSelectTagsComponent.prototype, "value", {
        /**
         * @return {?}
         */
        get: function () {
            return this.selected;
        },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            if (v && v !== this.selected) {
                this.selected = v;
                this.onChangeCallback(v);
            }
        },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(MSelectTagsComponent.prototype, "maxSelectHeight", {
        /**
         * @return {?}
         */
        get: function () {
            return 0.5 + 1.5 * this.maxContainerRows + 0.25 * (this.maxContainerRows - 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MSelectTagsComponent.prototype, "searchPanelHeight", {
        /**
         * @return {?}
         */
        get: function () {
            return this.maxPanelHeight ? this.maxPanelHeight : 'auto';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MSelectTagsComponent.prototype.onBlur = function () {
        this.onTouchedCallback();
    };
    /**
     * @param {?} value
     * @return {?}
     */
    MSelectTagsComponent.prototype.writeValue = function (value) {
        if (value && value !== this.selected) {
            this.selected = value;
        }
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    MSelectTagsComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    MSelectTagsComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    MSelectTagsComponent.prototype.setDisabledState = function (isDisabled) {
        // disable other components here
        if (isDisabled) {
            this.search.disable();
            this.isDisabled = true;
        }
        else {
            this.search.enable();
            this.isDisabled = false;
        }
    };
    /**
     * @return {?}
     */
    MSelectTagsComponent.prototype.onInputBlur = function () {
        this.search.setValue('');
    };
    /**
     * @return {?}
     */
    MSelectTagsComponent.prototype.checkItems = function () {
        return this.items && this.items.length > 0;
    };
    /**
     * @return {?}
     */
    MSelectTagsComponent.prototype.checkOverlayPosition = function () {
        var _this = this;
        var /** @type {?} */ positionTop = new Promise(function (resolve, reject) {
            var /** @type {?} */ defSearchPanelHeight = _this.searchPanelHeight === 'auto' ? null : parseInt(/** @type {?} */ (_this.searchPanelHeight));
            var /** @type {?} */ searchPanelOptionsHeight = _this.checkItems() ? _this.items.length * SELECT_OPTION_HEIGHT : 0;
            var /** @type {?} */ viewPortRect = _this.multiService.getViewportRect();
            var /** @type {?} */ searchPanelRect = _this.getSearchPanelRect();
            var /** @type {?} */ dropdownHeight = Math.min(searchPanelOptionsHeight, defSearchPanelHeight || searchPanelOptionsHeight);
            if ((viewPortRect.height - searchPanelRect.top - dropdownHeight < 0) &&
                (viewPortRect.top + searchPanelRect.top - dropdownHeight > 0)) {
                setTimeout(function () { return resolve(true); }, 0);
            }
            else {
                setTimeout(function () { return resolve(false); }, 0);
            }
        });
        return positionTop;
    };
    /**
     * @param {?} $event
     * @param {?} item
     * @return {?}
     */
    MSelectTagsComponent.prototype.add = function ($event, item) {
        var _this = this;
        if (this.selected.map(function (selItem) { return selItem[_this.listBy]; })
            .indexOf(item[this.listBy]) === -1) {
            this.value = this.selected.concat([item]);
        }
    };
    /**
     * @param {?} $event
     * @param {?} item
     * @return {?}
     */
    MSelectTagsComponent.prototype.remove = function ($event, item) {
        var _this = this;
        var /** @type {?} */ index = this.selected.map(function (selItem) { return selItem[_this.listBy]; })
            .indexOf(item[this.listBy]);
        if (index !== -1) {
            this.selected.splice(index, 1);
            this.value = this.selected;
        }
    };
    /**
     * @return {?}
     */
    MSelectTagsComponent.prototype.getSearchPanelRect = function () {
        return this.searchPanel.nativeElement.getBoundingClientRect();
    };
    return MSelectTagsComponent;
}());
MSelectTagsComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng2-mselect-tags',
                template: "<div class=\"input-data\" #searchPanel> <div class=\"search-field\"> <input type=\"text\" name=\"search\" [formControl]=\"search\" (blur)=\"onInputBlur()\" [placeholder]=\"placeholder || ''\"> </div> <div class=\"dropdown\" #dropdown [style.maxHeight.px]=\"searchPanelHeight\" [style.display]=\"isShown ? 'block' : 'none'\" [class.top]=\"isTop\"> <ul> <li *ngFor=\"let item of items\" (click)=\"add($event, item)\" [style.height]=\"selectOptionsHeight\">{{item[listBy]}} <svg id=\"add-icon\" fill=\"#000000\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\" /> <path d=\"M0 0h24v24H0z\" fill=\"none\" /> </svg> </li> </ul> </div> </div> <div class=\"collect\" [style.height.rem]=\"maxSelectHeight\"> <ul *ngIf=\"selected\"> <li *ngFor=\"let selItem of selected\" (click)=\"remove($event, selItem)\" [class.disabled]=\"isDisabled\">{{selItem[listBy]}} <div class=\"del\"> <svg id=\"rem-icon\" fill=\"#000000\" height=\"16\" viewBox=\"0 0 24 24\" width=\"16\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\" /> <path d=\"M0 0h24v24H0z\" fill=\"none\" /> </svg> </div> </li> </ul> </div>",
                styles: [":host { display: block; font-size: 1em; } :host * { box-sizing: border-box; } #add-icon { fill: #333; } #rem-icon { fill: #fff; } .input-data { position: relative; } .search-field { overflow: auto; margin: 0; } .search-field input { height: 2em; width: 100%; font-size: 1em; border: 1px solid #333; padding: 0.2em; } .dropdown { position: absolute; left: 0; right: 0; width: 100%; background: #fff; border: solid #333; border-width: 0 1px 1px 1px; z-index: 100; overflow: auto; } .dropdown ul { padding: 0; margin: 0; } .dropdown li { display: flex; align-items: center; padding: 4px; justify-content: space-between; cursor: pointer; } .dropdown li:hover { background: #eee; } .dropdown li i { display: none; } .dropdown li:hover i { display: block; } .dropdown.top { bottom: 2em; border-width: 1px 1px 0 1px; } .collect { border-bottom: 1px solid #333; overflow: auto; } .collect ul { list-style: none; padding: 0; margin: 0 0 0.25rem 0.25rem; } .collect li { position: relative; font-size: 0.8rem; display: inline-block; padding: 0.25rem; margin: 0.25rem 0.25rem 0 0; background: #eee; border-radius: 0.5rem; cursor: pointer; } .collect li.disabled { pointer-events: none; background: #e0e0e0; } .collect li .del { position: absolute;  top: 0; left: 0; right: 0; bottom: 0; z-index: 120; background: rgba(0,0,0,0.66); border-radius: 0.5rem; display: none; align-items: center; justify-content: center; } .collect li:hover .del { display: flex; }"],
                providers: [PARAM_TAGS_CONTROL_VALUE_ACCESSOR]
            },] },
];
/**
 * @nocollapse
 */
MSelectTagsComponent.ctorParameters = function () { return [
    { type: MSelectTagsService, },
]; };
MSelectTagsComponent.propDecorators = {
    'minChars': [{ type: Input },],
    'placeholder': [{ type: Input },],
    'list': [{ type: Input },],
    'searchUrl': [{ type: Input },],
    'accessBy': [{ type: Input },],
    'listBy': [{ type: Input },],
    'maxPanelHeight': [{ type: Input },],
    'maxContainerRows': [{ type: Input },],
    'dropdown': [{ type: ViewChild, args: ['dropdown',] },],
    'searchPanel': [{ type: ViewChild, args: ['searchPanel',] },],
};

var MSelectTagsModule = (function () {
    function MSelectTagsModule() {
    }
    return MSelectTagsModule;
}());
MSelectTagsModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule
                ],
                declarations: [
                    MSelectTagsComponent,
                ],
                providers: [
                    MSelectTagsService
                ],
                exports: [
                    MSelectTagsComponent,
                ]
            },] },
];
/**
 * @nocollapse
 */
MSelectTagsModule.ctorParameters = function () { return []; };

export { MSelectTagsModule, PARAM_TAGS_CONTROL_VALUE_ACCESSOR, SELECT_OPTION_HEIGHT, MSelectTagsComponent, MSelectTagsService };
