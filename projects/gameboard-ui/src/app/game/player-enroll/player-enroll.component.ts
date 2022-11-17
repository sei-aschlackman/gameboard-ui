// Copyright 2021 Carnegie Mellon University. All Rights Reserved.
// Released under a MIT (SEI)-style license. See LICENSE.md in the project root for license information.

import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { faCopy, faEdit, faPaste, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { HubConnectionState } from '@microsoft/signalr';
import { Observable, of, timer } from 'rxjs';
import { map, tap, first, takeUntil, catchError } from 'rxjs/operators';
import { GameEnrollmentContext } from '../../api/models';
import { NewPlayer, Player, PlayerEnlistment, TimeWindow } from '../../api/player-models';
import { PlayerService } from '../../api/player.service';
import { ConfigService } from '../../utility/config.service';
import { HubEventAction, NotificationService } from '../../utility/notification.service';

@Component({
  selector: 'app-player-enroll',
  templateUrl: './player-enroll.component.html',
  styleUrls: ['./player-enroll.component.scss']
})
export class PlayerEnrollComponent {
  @Input() ctx!: GameEnrollmentContext;
  ctx$: Observable<GameEnrollmentContext>;
  errors: any[] = [];
  code = '';
  invitation = '';
  token = '';
  isLoading = true;
  loadingText: string | undefined = "Loading your enrollment status...";

  faUser = faUser;
  faEdit = faEdit;
  faCopy = faCopy;
  faPaste = faPaste;
  faTrash = faTrash;

  disallowedName: string | null = null;
  disallowedReason: string | null = null;

  constructor (
    private api: PlayerService,
    private config: ConfigService,
    private notificationService: NotificationService,
    @Inject(DOCUMENT) private document: Document
  ) {

    this.ctx$ = timer(0, 1000).pipe(
      map(i => this.ctx),
      tap(ctx => {
        if (ctx.player) {
          ctx.player.session = new TimeWindow(ctx.player.sessionBegin, ctx.player.sessionEnd);
          ctx.game.session = new TimeWindow(ctx.game.gameStart, ctx.game.gameEnd);
          ctx.game.registration = new TimeWindow(ctx.game.registrationOpen, ctx.game.registrationClose);
        }

        this.setEnrollmentChange(false);
      }),
      tap(gc => {
        if (gc.player && gc.player.nameStatus && gc.player.nameStatus != 'pending') {
          if (this.disallowedName == null) {
            this.disallowedName = gc.player.name;
            this.disallowedReason = gc.player.nameStatus;
          }
        }
      }),
      tap(() => this.setEnrollmentChange(false))
    );
  }

  enroll(uid: string, gid: string): void {
    this.setEnrollmentChange(true, "Enrolling in the game...");
    const model = { userId: uid, gameId: gid } as NewPlayer;

    this.api.create(model).pipe(first()).subscribe(
      p => {
        this.enrolled(p);
      },
      err => {
        this.errors.push(err)
        this.setEnrollmentChange(false);
      }
    );
  }

  async invite(p: Player) {
    this.notificationService.state$.subscribe(async state => {
      this.code = ""
      this.invitation = "";

      this.api.invite(p.id).pipe(first())
        .subscribe(m => {
          this.code = m.code;
          this.invitation = `${this.config.absoluteUrl}game/teamup/${m.code}`;

          this.enrolled(p);
        });
    });
  }

  redeem(p: Player): void {
    this.setEnrollmentChange(true, "Joining the team...");
    const model = { playerId: p.id, code: this.token.split('/').pop() } as PlayerEnlistment;

    this.api.enlist(model).pipe(
      first(),
      tap(p => this.token = '')
    ).subscribe(
      async p => this.enrolled(p),
      err => this.errors.push(err)
    );
  }

  update(p: Player): void {
    if (!p.name.trim()) {
      p.name = '';
      return;
    }

    // If the user's name isn't the disallowed one, mark it as pending
    if (p.name != this.disallowedName) p.nameStatus = "pending";
    // Otherwise, if there is a disallowed reason as well, mark it as that reason
    else if (this.disallowedReason) p.nameStatus = this.disallowedReason;

    this.api.update(p)
      .pipe(first())
      .subscribe(
        () => this.api.transform(this.ctx.player!)
      );
  }

  delete(p: Player): void {
    this.setEnrollmentChange(true, "Unenrolling...");

    this.api.delete(p.id).pipe(
      first(),
      catchError(err => of(console.error("Player deletion error", err))),
      tap(_ => {
        this.ctx.player = null;
        this.enrolled(null);
        this.document.defaultView?.scrollTo({ top: 0 });
        this.setEnrollmentChange(false);
      })
    ).subscribe();
  }

  async enrolled(p: Player | null): Promise<void> {
    if (!p) {
      this.setEnrollmentChange(false);
      return;
    }

    // if this is a team game, hold the "is enrolling" status until we're done
    // dealing with the player hub
    if (this.ctx.game.allowTeam && p) {
      this.ctx.player = p;
      this.notificationService.init(p.teamId);

      // connectionId is null when disconnected
      if (this.notificationService.connection.connectionId) {
        this.notificationService.connection.invoke("Greet");
        this.notificationService.presenceEvents.next({ action: HubEventAction.arrived, model: p.teamId });
      }
      else {
        this.notificationService.state$.pipe(
          takeUntil(of(!!this.notificationService.connection.connectionId))
        ).subscribe();

        if (this.notificationService.connection.connectionId != null) {
          return;
        }

        if (!!this.notificationService.connection.connectionId && this.notificationService.connection.state != HubConnectionState.Connecting) {
          await this.notificationService.connection.start();
        }
      }
    }

    this.setEnrollmentChange(false);
  }

  private setEnrollmentChange(isChangingEnrollment: boolean, message: string | undefined = undefined): void {
    this.isLoading = isChangingEnrollment;
    this.loadingText = message;
  }
}
