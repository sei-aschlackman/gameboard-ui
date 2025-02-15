import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { faArrowLeft, faAward, faPrint, faMedal, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerCertificate } from '../../api/player-models';
import { PlayerService } from '../../api/player.service';

@Component({
  selector: 'app-certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: ['./certificate-list.component.scss']
})
export class CertificateListComponent implements OnInit {
  faArrowLeft = faArrowLeft;
  faAward = faAward;
  faMedal = faMedal;
  faPrint = faPrint;
  faUser = faUser
  faUsers = faUsers
  certs$: Observable<PlayerCertificate[]>;
  constructor(
    private apiPlayer: PlayerService,
    private sanitizer: DomSanitizer
    ) { 
      this.certs$ = apiPlayer.getUserCertificates().pipe(
        map(c => c.map(a => ({...a, safeHtml: sanitizer.bypassSecurityTrustHtml(a.html)}))
      ));
  }

  ngOnInit(): void {
  }

  print(html: string): void {
    let printWindow = window.open('', '', '');
    // make sure background is always there and no margins to print to pdf as is
    printWindow?.document?.write(`<style type="text/css">* {-webkit-print-color-adjust: exact !important; color-adjust: exact !important; }</style>`)
    printWindow?.document?.write(`<style type="text/css">@media print { body { margin: 0mm!important;} @page{ margin: 0mm!important; }}</style>`);
    printWindow?.document?.write(`<style type="text/css" media="print"> @page { size: landscape; } </style>`);
    printWindow?.document.write(html);
    printWindow?.document.close();
    printWindow?.focus();
    printWindow?.addEventListener('load', printWindow?.print, true); // wait until all content loads before printing
    // don't close new tab automatically in case want to keep open for some reason [ printWindow?.close(); ]
   }

}
