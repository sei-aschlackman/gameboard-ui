// Copyright 2021 Carnegie Mellon University. All Rights Reserved.
// Released under a MIT (SEI)-style license. See LICENSE.md in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameDesignerComponent } from './game-designer/game-designer.component';
import { UserRegistrarComponent } from './user-registrar/user-registrar.component';
import { UtilityModule } from '../utility/utility.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ApiModule } from '../api/api.module';
import { FormsModule } from '@angular/forms';
import { GameEditorComponent } from './game-editor/game-editor.component';
import { GameMapperComponent } from './game-mapper/game-mapper.component';
import { SpecBrowserComponent } from './spec-browser/spec-browser.component';
import { PlayerRegistrarComponent } from './player-registrar/player-registrar.component';
import { SponsorBrowserComponent } from './sponsor-browser/sponsor-browser.component';
import { PlayerSessionComponent } from './player-session/player-session.component';
import { ChallengeBrowserComponent } from './challenge-browser/challenge-browser.component';
import { UserReportComponent } from './user-report/user-report.component';
import { ReportPageComponent } from './report-page/report-page.component';
import { PlayerSponsorReportComponent } from './player-sponsor-report/player-sponsor-report.component';
import { ChallengeReportComponent } from './challenge-report/challenge-report.component';
import { AnnounceComponent } from './announce/announce.component';
import { ConsoleObserverComponent } from './console-observer/console-observer.component';

@NgModule({
  declarations: [
    AdminPageComponent,
    GameDesignerComponent,
    UserRegistrarComponent,
    PlayerRegistrarComponent,
    GameEditorComponent,
    GameMapperComponent,
    SpecBrowserComponent,
    DashboardComponent,
    SponsorBrowserComponent,
    PlayerSessionComponent,
    ChallengeBrowserComponent,
    UserReportComponent,
    ReportPageComponent,
    PlayerSponsorReportComponent,
    ChallengeReportComponent,
    AnnounceComponent,
    ConsoleObserverComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: AdminPageComponent, children: [
        { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'designer/:id', component: GameEditorComponent },
        { path: 'registrar/sponsors', component: SponsorBrowserComponent },
        { path: 'registrar/users', component: UserRegistrarComponent },
        { path: 'registrar/:id', component: PlayerRegistrarComponent },
        { path: 'observer/:id', component: ConsoleObserverComponent },
        { path: 'report', component: ReportPageComponent },
        { path: 'report/users', component: UserReportComponent },
        { path: 'report/sponsors', component: PlayerSponsorReportComponent },
        { path: 'report/challenges', component: ChallengeReportComponent },
        { path: 'support', component: ChallengeBrowserComponent }
        // { path: '**', redirectTo: 'dashboard' }
      ]},
    ]),
    ApiModule,
    UtilityModule,
    FontAwesomeModule,
    ButtonsModule
  ]
})
export class AdminModule { }
