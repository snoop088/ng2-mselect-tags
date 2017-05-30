import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MSelectTagsComponent } from './ng2-mselect-tags.component';

import { MSelectTagsService } from './ng2-mselect-tags.service';


@NgModule({
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
})
export class MSelectTagsModule {
}
