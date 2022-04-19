import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerObserverComponent } from './player-observer.component';

describe('PlayerObserverComponent', () => {
  let component: PlayerObserverComponent;
  let fixture: ComponentFixture<PlayerObserverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerObserverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerObserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
