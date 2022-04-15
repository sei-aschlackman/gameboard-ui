import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeurl'
})
export class SafeUrlPipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) {}
  
  transform(value: any, host: string, ...args: unknown[]): unknown {
    let url = `${host}?f=0&o=1&s=${value.challengeId}&v=${value.name}`
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
