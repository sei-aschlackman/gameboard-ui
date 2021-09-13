// Copyright 2021 Carnegie Mellon University. All Rights Reserved.
// Released under a MIT (SEI)-style license. See LICENSE.md in the project root for license information.

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowLeft, faPlus, faCopy, faTrash, faEdit, faUsers, faUsersCog, faCog, faTv } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { debounceTime, switchMap, tap, mergeMap } from 'rxjs/operators';
import { Game } from '../../api/game-models';
import { GameService } from '../../api/game.service';
import { Search } from '../../api/models';
import { ClipboardService } from '../../utility/clipboard.service';
import * as YAML from 'yaml';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  refresh$ = new BehaviorSubject<any>(true);
  creating$ = new Subject<Game>();
  created$: Observable<Game>;
  games$: Observable<Game[]>;
  games: Game[] = [];
  // game: any;
  search: Search = { term: '' };
  hot!: Game | null;

  faArrowLeft = faArrowLeft;
  faPlus = faPlus;
  faCopy = faCopy;
  faTrash = faTrash;
  faEdit = faEdit;
  faUsers = faUsersCog;
  faCog = faCog;
  faTv = faTv;

  constructor(
    private api: GameService,
    private clipboard: ClipboardService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.games$ = this.refresh$.pipe(
      debounceTime(250),
      switchMap(() => api.list(this.search)),
      tap(result => this.games = result)
    );

    this.created$ = this.creating$.pipe(
      mergeMap(m => api.create(m)),
      tap(m => this.games.unshift(m)),
      tap(m => this.select(m))
    );

  }

  ngOnInit(): void {
  }

  create(): void {
    this.creating$.next({name: 'NewGame'} as Game);
  }

  delete(game: Game): void {
    this.api.delete(game.id).subscribe(
      () => this.remove(game)
    );
  }

  remove(game: Game): void {
    const index = this.games.indexOf(game);
    this.games.splice(index, 1);
    // if (this.game === game) {
    //   this.game = null;
    // }
  }

  select(game: Game): void {
    this.router.navigate(['../designer', game.id], { relativeTo: this.route });
  }

  typing(e: Event): void {
    this.refresh$.next(true);
  }

  clone(game: Game): void {
    this.creating$.next({...game, name: `${game.name}_CLONE`, isPublished: false});
  }

  yaml(game: Game): void {
    this.clipboard.copyToClipboard(
      YAML.stringify(game, { keepNodeTypes: true })
    );
  }

  json(game: Game): void {
    this.clipboard.copyToClipboard(
      JSON.stringify(game, null, 2)
    );
  }

  trackById(index: number, g: Game): string {
    return g.id;
  }

  dropped(files: File[]): void {
    files.forEach(file => {
      const fr = new FileReader();
      fr.onload = ev => {
        const model = YAML.parse(fr.result as string) as Game[];
        model.forEach(m => this.creating$.next(m));
      }
      if (file.size < 8192) {
        fr.readAsText(file);
      }
    })
  }

  on(g: Game): void {
    this.hot = g;
  }
  off(g: Game): void {
    this.hot = null;
  }
}
