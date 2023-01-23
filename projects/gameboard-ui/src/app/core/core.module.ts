import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LongContentHiderComponent } from './components/long-content-hider/long-content-hider.component';
import { LinkifyHtmlPipe } from './pipes/linkify-html.pipe';
import { RelativeUrlsPipe } from './pipes/relative-urls.pipe';
import { PlayerAvatarComponent } from './components/player-avatar/player-avatar.component';

@NgModule({
  declarations: [
    LinkifyHtmlPipe,
    LongContentHiderComponent,
    RelativeUrlsPipe,
    PlayerAvatarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LinkifyHtmlPipe,
    LongContentHiderComponent,
    RelativeUrlsPipe,
    PlayerAvatarComponent
  ]
})
export class CoreModule { }
