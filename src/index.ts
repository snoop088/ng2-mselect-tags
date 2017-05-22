import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MSelectTagsComponent } from './ng2-mselect-tags.component';
import { MSelectTagsDirective } from './ng2-mselect-tags.directive';
import { MSelectTagsPile } from './ng2-mselect-tags.pipe';
import { MSelectTagsService } from './ng2-mselect-tags.service';

export * from './ng2-mselect-tags.component';
export * from './ng2-mselect-tags.directive';
export * from './ng2-mselect-tags.pipe';
export * from './ng2-mselect-tags.service';

@NgModule({
  imports: [
    CommonModule
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
})
export class MSelectTagsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MSelectTagsModule,
      providers: [MSelectTagsService]
    };
  }
}
