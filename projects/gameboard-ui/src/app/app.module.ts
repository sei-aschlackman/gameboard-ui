// Copyright 2021 Carnegie Mellon University. All Rights Reserved.
// Released under a MIT (SEI)-style license. See LICENSE.md in the project root for license information.

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { Observable } from 'rxjs';
import { ApiModule } from './api/api.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './utility/auth.interceptor';
import { ConfigService, markedOptionsFactory } from './utility/config.service';
import { UserService } from './utility/user.service';
import { UtilityModule } from './utility/utility.module';
import { SupportPillComponent } from './support/support-pill/support-pill.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent,
    SupportPillComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    AppRoutingModule,
    ApiModule,
    FontAwesomeModule,
    UtilityModule,
    TooltipModule.forRoot(),
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory,
      },
    }),

  ],
  exports: [
    ApiModule,
    UtilityModule,
    FontAwesomeModule,
    ButtonsModule,
    ModalModule,
    BsDropdownModule,
    MarkdownModule,
    TooltipModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: loadSettings,
      deps: [ConfigService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: register,
      deps: [UserService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function loadSettings(
  config: ConfigService,
): (() => Observable<any>) {
  return (): Observable<any> => config.load()
    ;
}

export function register(
  user: UserService
): (() => Promise<void>) {
  return (): Promise<void> => user.register()
    ;
}
