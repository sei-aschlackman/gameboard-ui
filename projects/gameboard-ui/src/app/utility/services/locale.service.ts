import { Injectable } from '@angular/core';
import { NavigatorService } from './navigator.service';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  constructor (private navigatorService: NavigatorService) { }

  getLocale(): string {
    return this.navigatorService.getNavigator().language;
  }
}
