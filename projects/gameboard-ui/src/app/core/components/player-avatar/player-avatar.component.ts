import { Component, Input, OnInit } from '@angular/core';
import { WindowService } from '../../../../services/window.service';

@Component({
  selector: 'app-player-avatar',
  templateUrl: './player-avatar.component.html',
  styleUrls: ['./player-avatar.component.scss']
})
export class PlayerAvatarComponent implements OnInit {
  @Input() sponsorLogoUri!: string;
  uriBase!: string;

  constructor(private windowService: WindowService) { }

  ngOnInit(): void {
    this.uriBase = this.windowService.get()!.location.origin;
  }
}
