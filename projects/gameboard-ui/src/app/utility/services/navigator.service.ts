import { Inject, Injectable, InjectionToken } from '@angular/core';

export const NAVIGATOR = new InjectionToken("navigator");

@Injectable({ providedIn: 'root' })
export class NavigatorService {
  constructor (@Inject(NAVIGATOR) private navigator: Navigator) { }

  getNavigator() {
    return this.navigator;
  }
}
