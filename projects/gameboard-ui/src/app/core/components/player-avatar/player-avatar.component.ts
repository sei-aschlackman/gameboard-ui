import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player-avatar',
  templateUrl: './player-avatar.component.html',
  styleUrls: ['./player-avatar.component.scss']
})
export class PlayerAvatarComponent {
  @Input() sponsorLogoUri?: string;
}
