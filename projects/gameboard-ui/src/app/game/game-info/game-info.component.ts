// Copyright 2021 Carnegie Mellon University. All Rights Reserved.
// Released under a MIT (SEI)-style license. See LICENSE.md in the project root for license information.

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../../api/game-models';
import { GameService } from '../../api/game.service';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit {
  @Input() game!: Game;

  // game$!: Observable<Game>;

  constructor (
    route: ActivatedRoute,
    api: GameService
  ) {
    // if (!route.parent){ return; }
    // this.game$ = route.parent.params.pipe(
    //   switchMap(p => api.retrieve(p.id)),
    // );
  }

  ngOnInit(): void {
  }

}
