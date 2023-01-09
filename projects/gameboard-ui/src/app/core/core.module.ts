import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LongContentHiderComponent } from './components/long-content-hider/long-content-hider.component';
import { LinkifyHtmlPipe } from './pipes/linkify-html.pipe';

@NgModule({
  declarations: [
    LinkifyHtmlPipe,
    LongContentHiderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LinkifyHtmlPipe,
    LongContentHiderComponent
  ]
})
export class CoreModule { }
