// Copyright 2021 Carnegie Mellon University. All Rights Reserved.
// Released under a MIT (SEI)-style license. See LICENSE.md in the project root for license information.

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCaretDown, faCaretRight, faExternalLinkAlt, faListOl } from '@fortawesome/free-solid-svg-icons';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { filter, first, map, startWith, switchMap, tap, zipAll } from 'rxjs/operators';
import { GameService } from '../../api/game.service';
import { GameEnrollmentContext } from '../../api/models';
import { Player } from '../../api/player-models';
import { PlayerService } from '../../api/player.service';
import { ApiUser } from '../../api/user-models';
import { UserService as LocalUserService } from '../../utility/user.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent {
  ctx$: Observable<GameEnrollmentContext>;
  showCert = false;
  isLoading = true;
  minDate = new Date(1, 1, 1, 0, 0, 0, 0);
  playerUpdate$ = new Subject<Player | null>();

  faLink = faExternalLinkAlt;
  faList = faListOl;
  faCaretDown = faCaretDown;
  faCaretRight = faCaretRight;

  constructor (
    router: Router,
    route: ActivatedRoute,
    apiGame: GameService,
    apiPlayer: PlayerService,
    local: LocalUserService
  ) {

    const user$ = local.user$.pipe(
      map(u => !!u ? u : {} as ApiUser)
    );

    const game$ = route.params.pipe(
      filter(p => !!p.id),
      tap(() => this.isLoading = true),
      switchMap(p => apiGame.retrieve(p.id)),
      tap(() => this.isLoading = false)
    );

    const player$ = combineLatest([
      route.params,
      local.user$,
      this.playerUpdate$.pipe(startWith(null))
    ]).pipe(
      map(([params, user, player]) => ({ gid: params?.id, uid: user?.id, player: player })),
      switchMap(playerCtx => {
        // if we already know the player (because we got it from the session component, just use that.
        if (playerCtx.player) {
          return of(playerCtx.player);
        }

        // otherwise, we might have to check the API to see if they already have a game
        this.isLoading = true;
        return apiPlayer.list({ gid: playerCtx.gid, uid: playerCtx.uid }).pipe(
          first(),
          map(p => p.length ? p[0] : null),
          tap(p => {
            this.isLoading = false
          }),
        )
      })
    );

    this.ctx$ = combineLatest([user$, game$, player$]).pipe(
      map(([user, game, player]) => ({ user, game, player })),
      tap(c => {
        if (!c.game) { router.navigateByUrl("/"); }
      }),
      filter(c => !!c.game || !!c.user)
    );
  }

  onSessionEnded(uid: string) {
    this.playerUpdate$.next(null);
  }

  onSessionStarted(p: Player) {
    this.playerUpdate$.next(p);
  }

  ctxToGameContext = (ctx: GameEnrollmentContext) => ({ game: ctx.game, user: ctx.user, player: ctx.player! });
}
