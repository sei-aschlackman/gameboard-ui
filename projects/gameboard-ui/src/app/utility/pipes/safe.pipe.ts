import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor (private domSanitizer: DomSanitizer) { }

  transform(value: unknown, ...args: unknown[]): unknown {
    if (!args || !args.length) {
      throw new Error(`Can't use pipe ${SafePipe.name} without an argument.`);
    }

    const stringValue = value as string;
    let securityContext: SecurityContext | undefined;

    switch ((args[0] as string).toLowerCase()) {
      case "html":
        securityContext = SecurityContext.HTML;
        break;
      case "resourceUrl":
        securityContext = SecurityContext.RESOURCE_URL;
        break;
      case "url":
        securityContext = SecurityContext.URL;
        break;
      case "script":
        securityContext = SecurityContext.SCRIPT;
        break;
    }

    if (!securityContext) {
      throw new Error(`Couldn't resolve security context for value ${value} and parameter ${args[0]}`);
    }

    return this.domSanitizer.sanitize(securityContext, value as string);
  }
}
