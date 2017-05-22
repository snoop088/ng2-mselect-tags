import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[ng2MselectTags]'
})
export class MSelectTagsDirective {

  constructor(private el: ElementRef) {
  }

}
