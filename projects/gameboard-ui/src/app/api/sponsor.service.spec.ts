// Copyright 2021 Carnegie Mellon University. All Rights Reserved.
// Released under a MIT (SEI)-style license. See LICENSE.md in the project root for license information.

import { TestBed } from '@angular/core/testing';

import { SponsorService } from './sponsor.service';

describe('SponsorService', () => {
  let service: SponsorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SponsorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
