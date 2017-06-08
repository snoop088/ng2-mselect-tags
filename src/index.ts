import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MSelectTagsComponent } from './ng2-mselect-tags.component';
import { MSelectTagsService } from './ng2-mselect-tags.service';
import { HttpModule } from '@angular/http';

export * from './ng2-mselect-tags.component';
export * from './ng2-mselect-tags.service';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  declarations: [
    MSelectTagsComponent,
  ],
  providers: [
    MSelectTagsService,
  ],
  exports: [
    MSelectTagsComponent,
  ]
})
export class MSelectTagsModule {
}
