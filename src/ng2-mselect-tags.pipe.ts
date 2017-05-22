import { Injectable, PipeTransform, Pipe } from '@angular/core';

/**
 * Transforms any input value
 */
@Pipe({
  name: 'ng2-mselect-tags'
})
@Injectable()
export class MSelectTagsPile implements PipeTransform {
  transform(value: any, args: any[] = null): string {
    return value;
  }
}
