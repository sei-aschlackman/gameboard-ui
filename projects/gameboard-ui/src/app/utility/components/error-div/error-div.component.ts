// Copyright 2021 Carnegie Mellon University. All Rights Reserved.
// Released under a MIT (SEI)-style license. See LICENSE.md in the project root for license information.

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-div',
  templateUrl: './error-div.component.html',
  styleUrls: ['./error-div.component.scss']
})
export class ErrorDivComponent implements OnInit {
  @Input() errors!: any[];

  constructor() { }

  ngOnInit(): void {
  }

  closed(e: any): void {
    const i = this.errors.indexOf(e);
    if (i >= 0) {
      this.errors.splice(i, 1);
    }
  }
}
