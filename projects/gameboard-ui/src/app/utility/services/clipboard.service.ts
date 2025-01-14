// Copyright 2021 Carnegie Mellon University. All Rights Reserved.
// Released under a MIT (SEI)-style license. See LICENSE.md in the project root for license information.

import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ClipboardService {
  private _clipboard: Clipboard;

  constructor (@Inject(DOCUMENT) private dom: Document) {
    this._clipboard = navigator.clipboard;
  }

  async copy(text: string) {
    this._clipboard.writeText(text);
  }

  async paste(): Promise<string> {
    return await this._clipboard.readText();
  }

  copyToClipboard(text: string): void {
    const el = this.dom.createElement('textarea') as HTMLTextAreaElement;
    el.style.position = 'fixed';
    el.style.top = '-200';
    el.style.left = '-200';
    this.dom.body.appendChild(el);
    el.value = text;
    el.select();
    this.dom.execCommand('copy');
    this.dom.body.removeChild(el);
  }
}
