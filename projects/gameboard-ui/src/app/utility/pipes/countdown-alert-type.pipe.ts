import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '../config.service';

@Pipe({ name: 'countdownAlertType' })
export class CountdownAlertPipe implements PipeTransform {
  startSecondsAtMinute: number = 5; // default to 5 minutes

  constructor (private config?: ConfigService) {
    if ((config?.settings.countdownStartSecondsAtMinute ?? 0) > 0) // lowest allowed setting is 1 min
      this.startSecondsAtMinute = config?.settings.countdownStartSecondsAtMinute!;
  }

  transform(value: number, ...args: unknown[]): string {
    if (value >= (1000 * 60 * 60)) { // >= 1 hour
      return "info";
    } else if (value >= (1000 * 60 * this.startSecondsAtMinute)) { // < 1 hour and >= <threshold> min
      return "warning";
    } else if (value != 0) {  // < <threshold> min and not 0 (game over)
      return "danger";
    }

    throw new Error(`Couldn't resolve alert type for ${CountdownAlertPipe.name} with value ${value}.`)
  }
}
