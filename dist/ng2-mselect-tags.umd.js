(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms'), require('@angular/common'), require('rxjs/Observable'), require('rxjs/add/operator/debounceTime'), require('rxjs/add/operator/distinctUntilChanged'), require('rxjs/add/observable/of'), require('rxjs/add/operator/filter'), require('rxjs/add/operator/map'), require('rxjs/add/operator/switchMap'), require('@angular/http'), require('rxjs/add/operator/mergeMap')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/forms', '@angular/common', 'rxjs/Observable', 'rxjs/add/operator/debounceTime', 'rxjs/add/operator/distinctUntilChanged', 'rxjs/add/observable/of', 'rxjs/add/operator/filter', 'rxjs/add/operator/map', 'rxjs/add/operator/switchMap', '@angular/http', 'rxjs/add/operator/mergeMap'], factory) :
	(factory((global['ng2-mselect-tags'] = global['ng2-mselect-tags'] || {}),global._angular_core,global._angular_forms,global._angular_common,global.rxjs_Observable,null,null,null,null,null,null,global._angular_http));
}(this, (function (exports,_angular_core,_angular_forms,_angular_common,rxjs_Observable,rxjs_add_operator_debounceTime,rxjs_add_operator_distinctUntilChanged,rxjs_add_observable_of,rxjs_add_operator_filter,rxjs_add_operator_map,rxjs_add_operator_switchMap,_angular_http) { 'use strict';

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
            return rxjs_Observable.Observable.of(null);
        }
    };
    /**
     * @param {?} url
     * @param {?} keyword
     * @return {?}
     */
    MSelectTagsService.prototype.composeUrl = function (url, keyword) {
        var /** @type {?} */ composedUrl = "";
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
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
MSelectTagsService.ctorParameters = function () { return [
    { type: _angular_http.Http, },
]; };

var PARAM_TAGS_CONTROL_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MSelectTagsComponent; }),
    multi: true
};
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
        this.onTouchedCallback = function () { };
        this.onChangeCallback = function () { };
        this.search = new _angular_forms.FormControl();
    }
    /**
     * @return {?}
     */
    MSelectTagsComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.list.length > 0) {
            this.items = this.list;
        }
        else {
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
                    return rxjs_Observable.Observable.of(null);
                }
                return _this.multiService.getAsyncOptions(_this.searchUrl, searchTerm, _this.accessBy);
            })
                .subscribe(function (result) {
                _this.items = result;
                console.log(_this.items);
            });
        }
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
            return this.maxContainerRows * 1.5;
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
    MSelectTagsComponent.prototype.calculateHeight = function () {
        return this.maxPanelHeight ? this.maxPanelHeight : 'auto';
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
        // if (this.selected.indexOf(item) === -1){ // Item hasn't been selected
        //   this.selected = [...this.selected, item];
        // }
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
    return MSelectTagsComponent;
}());
MSelectTagsComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ng2-mselect-tags',
                template: "\n  <div class=\"input-field\">\n    <input type=\"text\" name=\"search\" [formControl]=\"search\" (blur)=\"onInputBlur()\" placeholder=\"Enter team name\">\n  </div>\n  <div class=\"dropdown z-depth-1\" [style.maxHeight.px]=\"calculateHeight()\">\n    <ul>\n      <li *ngFor=\"let item of items\" (click)=\"add($event, item)\">{{item[listBy]}}\n        <i class=\"material-icons\">add</i>\n      </li>\n    </ul>\n  </div>\n  <div class=\"collect\" [style.height.em]=\"maxSelectHeight\">\n    <ul *ngIf=\"selected\">\n      <li *ngFor=\"let selItem of selected\" (click)=\"remove($event, selItem)\" [class.disabled]=\"isDisabled\">{{selItem[listBy]}}\n        <div class=\"del\"><i class=\"material-icons\">clear</i></div>\n      </li>\n    </ul>\n  </div>",
                styles: [":host { display: block; position: relative; } :host .input-field input, :host .input-field { margin: 0; padding: 0; } :host .input-field { margin-top: -1rem; } .dropdown { position: absolute; left: 0; right: 0; width: 100%; background: #fff; /*display: none;*/ border: solid #41A62A; border-width: 0 1px 1px 1px; z-index: 100; overflow: auto; } .dropdown ul { padding: 0; margin: 0; } .dropdown li { display: flex; align-items: center; padding: 0.5rem; justify-content: space-between; cursor: pointer; } .dropdown li:hover { background: #eee; } .dropdown li i { display: none; color: #41A62A; font-size: 1.2rem; } .dropdown li:hover i { display: block; } .dropdown.active { display: block; } .dropdown.pos-bottom { top: 2rem; } .dropdown.pos-top { bottom: 2rem; } .collect { border-bottom: 1px solid #888; overflow: auto; } .collect ul { list-style: none; padding: 0; margin: 0; } .collect li { position: relative; font-size: 0.8rem; display: inline-block; padding: 0.25rem; margin: 0.25rem; background: #eee; border-radius: 0.5rem; cursor: pointer; } .collect li.disabled { pointer-events: none; background: #e0e0e0; } .collect li .del { position: absolute;  top: 0; left: 0; right: 0; bottom: 0; z-index: 120; background: rgba(0,0,0,0.66); border-radius: 0.5rem; display: none; align-items: center; justify-content: center; } .collect li:hover .del { display: flex; } .collect i { display: block; font-size: 1em; color: #fff; }"],
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
    'minChars': [{ type: _angular_core.Input },],
    'list': [{ type: _angular_core.Input },],
    'searchUrl': [{ type: _angular_core.Input },],
    'accessBy': [{ type: _angular_core.Input },],
    'listBy': [{ type: _angular_core.Input },],
    'maxPanelHeight': [{ type: _angular_core.Input },],
    'maxContainerRows': [{ type: _angular_core.Input },],
};

var MSelectTagsDirective = (function () {
    /**
     * @param {?} el
     */
    function MSelectTagsDirective(el) {
        this.el = el;
    }
    return MSelectTagsDirective;
}());
MSelectTagsDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[ng2MselectTags]'
            },] },
];
/**
 * @nocollapse
 */
MSelectTagsDirective.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
]; };

/**
 * Transforms any input value
 */
var MSelectTagsPile = (function () {
    function MSelectTagsPile() {
    }
    /**
     * @param {?} value
     * @param {?=} args
     * @return {?}
     */
    MSelectTagsPile.prototype.transform = function (value, args) {
        if (args === void 0) { args = null; }
        return value;
    };
    return MSelectTagsPile;
}());
MSelectTagsPile.decorators = [
    { type: _angular_core.Pipe, args: [{
                name: 'ng2-mselect-tags'
            },] },
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
MSelectTagsPile.ctorParameters = function () { return []; };

var MSelectTagsModule = (function () {
    function MSelectTagsModule() {
    }
    /**
     * @return {?}
     */
    MSelectTagsModule.forRoot = function () {
        return {
            ngModule: MSelectTagsModule,
            providers: [MSelectTagsService]
        };
    };
    return MSelectTagsModule;
}());
MSelectTagsModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule,
                    _angular_forms.FormsModule,
                    _angular_forms.ReactiveFormsModule
                ],
                declarations: [
                    MSelectTagsComponent,
                    MSelectTagsDirective,
                    MSelectTagsPile
                ],
                exports: [
                    MSelectTagsComponent,
                    MSelectTagsDirective,
                    MSelectTagsPile
                ]
            },] },
];
/**
 * @nocollapse
 */
MSelectTagsModule.ctorParameters = function () { return []; };

exports.MSelectTagsModule = MSelectTagsModule;
exports.PARAM_TAGS_CONTROL_VALUE_ACCESSOR = PARAM_TAGS_CONTROL_VALUE_ACCESSOR;
exports.MSelectTagsComponent = MSelectTagsComponent;
exports.MSelectTagsDirective = MSelectTagsDirective;
exports.MSelectTagsPile = MSelectTagsPile;
exports.MSelectTagsService = MSelectTagsService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
