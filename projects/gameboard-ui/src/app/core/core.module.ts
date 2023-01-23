import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LongContentHiderComponent } from './components/long-content-hider/long-content-hider.component';
import { LinkifyHtmlPipe } from './pipes/linkify-html.pipe';
import { PlayerAvatarComponent } from './components/player-avatar/player-avatar.component';

@NgModule({
  declarations: [
    LinkifyHtmlPipe,
    LongContentHiderComponent,
    PlayerAvatarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LinkifyHtmlPipe,
    LongContentHiderComponent,
    PlayerAvatarComponent
  ]
})
export class CoreModule { }
