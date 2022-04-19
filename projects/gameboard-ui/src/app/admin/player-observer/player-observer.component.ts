import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faArrowLeft, faSyncAlt, faTv, faExternalLinkAlt, faExpandAlt, faUser, faThLarge, faMinusSquare, faPlusSquare, faCompressAlt, faSortAlphaDown, faSortAmountDownAlt, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import { combineLatest, timer, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, tap, switchMap, map } from 'rxjs/operators';
import { ConsoleActor, ObserveChallenge, ObserveVM } from '../../api/board-models';
import { BoardService } from '../../api/board.service';
import { ObservePlayer, Player } from '../../api/player-models';
import { PlayerService } from '../../api/player.service';
import { ConfigService } from '../../utility/config.service';
@Component({
  selector: 'app-player-observer',
  templateUrl: './player-observer.component.html',
  styleUrls: ['./player-observer.component.scss']
})
export class PlayerObserverComponent implements OnInit, OnDestroy {
  refresh$ = new BehaviorSubject<boolean>(true);
  table: Map<string, ObservePlayer> = new Map<string, ObservePlayer>(); // table of player challenges to display
  tableData: Subscription; // subscribe to stream of new data to update table map
  actorMap: Map<string, ConsoleActor> = new Map<string, ConsoleActor>();
  fetchActors$: Observable<Map<string, ConsoleActor>>; // stream updates of mapping users to consoles
  typing$ = new BehaviorSubject<string>(""); // search term typing event
  term$: Observable<string>; // search term to filter by
  gid = '';
  mksHost: string; // host url for mks console viewer
  sort: string = "byName"; // default sort method, other is "byRank"
  maxRank: number = 1;
  faArrowLeft = faArrowLeft;
  faTv = faTv;
  faSync = faSyncAlt;
  faGrid = faThLarge;
  faExternalLinkAlt = faExternalLinkAlt
  faExpandAlt = faExpandAlt
  faCompressAlt = faCompressAlt;
  faUser = faUser
  faMinusSquare = faMinusSquare;
  faPlusSquare = faPlusSquare;
  faSortAmountDown = faSortAmountDownAlt
  faSortAlphaDown = faSortAlphaDown;
  faAngleDoubleUp = faAngleDoubleUp;
  constructor(
    route: ActivatedRoute,
    private api: BoardService,
    private playerApi: PlayerService,
    private conf: ConfigService
  ) {
    this.mksHost = conf.mkshost;
    this.tableData = combineLatest([
      route.params,
      this.refresh$,
      timer(0, 60_000) // *every 60 sec* refresh challenge data (score/duration updates and new deploys) 
    ]).pipe(
      debounceTime(500),
      tap(([a, b, c]) => this.gid = a.id),
      switchMap(() => this.playerApi.list({gid: this.gid, sort:'name', filter:'active'}))
    ).subscribe(data =>{
      this.updateTable(data);
    });
    this.fetchActors$ = combineLatest([
      route.params,
      this.refresh$,
      timer(0, 10_000) // *every 10 sec* refresh which users are one which consoles 
    ]).pipe(
      debounceTime(500),
      tap(([a, b, c]) => this.gid = a.id),
      switchMap(() => this.api.consoleActors(this.gid)),
      map(data => new Map(data.map(i => [i.userId, i]))) 
    );
    this.term$ = this.typing$.pipe(
      debounceTime(500)
    )
  }

  updateTable(data: Player[]) { 
    for (let updatedPlayer of data) {
      if (this.table.has(updatedPlayer.userId)) {
        // modify fields with updates values without resetting the entire challenge object
        let player = this.table.get(updatedPlayer.userId)!;
        player.rank = updatedPlayer.rank;
        player.score = updatedPlayer.score;
        player.time = updatedPlayer.time;
      } else {
        this.table.set(updatedPlayer.userId, updatedPlayer as unknown as ObservePlayer);
      }
      if (updatedPlayer.rank > this.maxRank)
        this.maxRank = updatedPlayer.rank;
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.tableData.unsubscribe();
  }

  go(player: ObservePlayer): void {
    this.conf.openConsole(`?f=0&o=1&u=${player.userId}`);
  }

  toggleShowConsole(player: ObservePlayer) {
    player.expanded = !player.expanded;
  }
  
  togglePinRow(player: ObservePlayer) {
    player.pinned = !player.pinned;
  }

  toggleFullWidthVM(player: ObservePlayer) {
    player.fullWidthVM = !player.fullWidthVM;
  }

  // Custom Functions for "ngFor"

  // TrackBy Function to only reload rows when needed
  // Helpful for inserting new player row asynchronously without reloading existing rows
  trackByChallengeId(_index: number, challengeItem: KeyValue<string, ObservePlayer>) {
    return challengeItem.value.userId;
  }

  // Order by PlayerName (team name), then order by UserName
  // I.E. Sort alphabetically by Team Name, then order by username for players of the same team
  // Note: this is the same sorting done on the server, however this is needed for inserting new rows asynchronously in order.
  sortByName(a: KeyValue<string, ObservePlayer>, b: KeyValue<string, ObservePlayer>) {
    if (a.value.approvedName < b.value.approvedName) return -1;
    if (a.value.approvedName > b.value.approvedName) return 1;
    if (a.value.userName < b.value.userName) return -1;
    if (a.value.userName > b.value.userName) return 1;
    return 0;
  }
}
