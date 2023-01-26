import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player-avatar-list',
  template: `
  <div class="player-avatar-list-component">
    <ul>
      <li *ngFor="let sponsorUri of sponsorUris; index as i" [class]="'player-avatar-item avatar-position-' + i">
          <app-player-avatar [sponsorLogoUri]="sponsorUri"></app-player-avatar>
      </li>
    </ul>
  </div>
  `,
  styleUrls: ['./player-avatar-list.component.scss']
})
export class PlayerAvatarListComponent {
  @Input() sponsorUris: string[] = [];
}
