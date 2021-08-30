// Copyright 2021 Carnegie Mellon University. All Rights Reserved.
// Released under a MIT (SEI)-style license. See LICENSE.md in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TocPageComponent } from './toc-page.component';

describe('TocPageComponent', () => {
  let component: TocPageComponent;
  let fixture: ComponentFixture<TocPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TocPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TocPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
