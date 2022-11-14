// Copyright 2021 Carnegie Mellon University. All Rights Reserved.
// Released under a MIT (SEI)-style license. See LICENSE.md in the project root for license information.

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { faBolt, faCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { interval, Observable, of, Subscription, timer } from 'rxjs';
import { catchError, first, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { GameEnrollmentContext } from '../../api/models';
import { Player, TimeWindow } from '../../api/player-models';
import { PlayerService } from '../../api/player.service';
import { UnityService } from '../../unity/unity.service';
import { HubEvent, HubEventAction, HubState, NotificationService } from '../../utility/notification.service';

@Component({
  selector: 'app-player-session',
  templateUrl: './player-session.component.html',
  styleUrls: ['./player-session.component.scss']
})
export class PlayerSessionComponent implements OnChanges {
  @Input() ctx$: Observable<GameEnrollmentContext> | null = null;
  @Output() sessionStarted = new EventEmitter<Player>();
  @Output() sessionEnded = new EventEmitter<string>();
  hub$: Observable<HubState> | null = null;
  teamEvents$: Observable<HubEvent> | null = null;
  errors: any[] = [];
  isChangingSessionStatus = false;
  statusText: string | undefined;
  doublechecking = false;

  // borrowed from the context
  isUnityGame = false;

  faBolt = faBolt;
  faTrash = faTrash;
  faDot = faCircle;

  private ctxSub: Subscription | null = null;

  constructor (
    private api: PlayerService,
    private hub: NotificationService,
    private unityService: UnityService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ctx$.currentValue === changes.ctx$.previousValue) {
      return;
    }

    if (this.ctxSub != null) {
      this.cleanupCtxObservable(this.ctxSub)
    }

    this.ctxSub = this
      .startCtxObservable(changes.ctx$.currentValue)
      .subscribe();
  }

  private cleanupCtxObservable(ctxSub: Subscription) {
    this.hub.disconnect();
    ctxSub.unsubscribe();
  }

  private startCtxObservable(ctx$: Observable<GameEnrollmentContext>): Observable<GameEnrollmentContext> {
    return ctx$.pipe(
      tap(ctx => {
        if (ctx.player) {
          this.adjustPlayerSession(ctx.player);
        }
        ctx.game.session = new TimeWindow(ctx.game.gameStart, ctx.game.gameEnd);

        // record some stuff about the current game
        this.isUnityGame = ctx.game.mode == "unity";

        // start the team hub if the game needs one
        // listen for hub session events (update / start) to keep team sync'd
        this.hub$ = this.hub.state$.pipe();
        this.teamEvents$ = this.hub.teamEvents.pipe(
          tap(e => {
            if (!ctx.player) {
              return;
            }

            ctx.player = ({ ...ctx.player, ...e.model });
            this.api.transform(ctx.player!);

            if (e.action === HubEventAction.deleted) {
              this.sessionEnded.emit(ctx.user.id);
              ctx.player = null as unknown as Player;
            }
          })
        );

        if (ctx.player && ctx.game.allowTeam && !ctx.player.session?.isAfter) {
          this.hub.init(ctx.player.teamId);
        }
      }),
    );
  }

  start(p: Player): void {
    this.setLoadingStatus(true, "Starting your session...");

    this.api.start(p).pipe(first()).subscribe(p => {
      this.adjustPlayerSession(p);
      this.sessionStarted.emit(p);
    },
      err => this.errors.push(err),
      () => {
        this.doublechecking = false;
        this.setLoadingStatus(false);
      }
    );
  }

  reset(p: Player): void {
    this.setLoadingStatus(true, "Restarting your session...");

    if (this.isUnityGame) {
      this.unityService.undeployGame({ ctx: { gameId: p.gameId, teamId: p.teamId } }).pipe(
        first(),
        catchError(err => of(`Unity undeploy failure: ${err}`)),
        switchMap(_ => this.api.delete(p.id)),
      ).subscribe(() => {
        this.sessionEnded.emit(p.userId);
        this.setLoadingStatus(false);
      });
    }
    else {
      this.api.delete(p.id).subscribe(() => {
        // this is completely irrational, but just in case
        this.setLoadingStatus(false);
        // OK NOW
        window.location.reload();
      });
    }
  }

  // TODO: revisit this after PresCup 2022. The client probably shouldn't care what time the server thinks it is;
  // it should just know how much time it has left in the session.
  private adjustPlayerSession(p: Player) {
    const beginDate = new Date(p.sessionBegin.toString());
    const serverTimeDifference = beginDate.getTime() - new Date().getTime();
    const endDate = new Date(p.sessionEnd.toString());

    const adjustedBeginDate = serverTimeDifference > 0 ? beginDate.getTime() - serverTimeDifference : beginDate.getTime() + serverTimeDifference;
    const adjustedEndDate = serverTimeDifference > 0 ? endDate.getTime() - serverTimeDifference : endDate.getTime() + serverTimeDifference;

    p.sessionBegin = new Date(adjustedBeginDate);
    p.sessionEnd = new Date(adjustedEndDate);
    p.session = new TimeWindow(p.sessionBegin, p.sessionEnd);
  }

  private setLoadingStatus(isLoading: boolean, statusText?: string | undefined) {
    this.isChangingSessionStatus = isLoading;
    this.statusText = statusText;
  }
}
