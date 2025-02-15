// Copyright 2021 Carnegie Mellon University.
// Released under a 3 Clause BSD-style license. See LICENSE.md in the project root.

import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { filter, finalize, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { faTrash, faArrowDown, faPaperclip, faUpload, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { SupportService } from '../../../api/support.service';
import { NewTicket } from '../../../api/support-models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-manager',
  templateUrl: './image-manager.component.html',
  styleUrls: ['./image-manager.component.scss']
})
export class ImageManagerComponent implements OnInit, OnChanges {
  @Input() maxCombinedSizeMB = 30;

  @Input() showIcon = true;
  @Input() defaultHeight = 200;
  @Input() browseButtonStyle = "btn-outline-secondary";

  @Output() added = new EventEmitter<File[]>(); // emit files to parent component when changed

  @Input() reset$?: Subject<boolean>;

  dropzone = false;
  drops = new Subject<FileList>();
  refresh = new BehaviorSubject<boolean>(true);
  maxImageSize = 5E7;
  activeImage?: any;
  faTrash = faTrash;
  faPaperclip = faPaperclip;
  faUpload = faUpload;
  faFileAlt = faFileAlt;

  combineSize = 0;

  files = new Map<string, FileData>();

  constructor(
    api: SupportService,
    private sanitizer: DomSanitizer
  ) {

    this.drops.pipe(
      map(a => Array.from(a)),
    ).subscribe(
      files => {

        files.forEach(file => {
          var key = file.name + file.lastModified;
          if (!this.files.has(key)) {
            if (this.combineSize + file.size < this.maxCombinedSizeMB * 1_000_000) {
              this.combineSize += file.size;
              var data: FileData = {file: file}
              if (file.type.match(/(image|application)\/(png|jpeg|gif|webp|svg)/)) {
                const reader = new FileReader();
                reader.onload = e => {
                  var result = reader.result as string;
                  if (!!result)
                    data.encoded = sanitizer.bypassSecurityTrustResourceUrl(result);
                }
                reader.readAsDataURL(file);
              }
              this.files.set(key, data)
            }
          }
        });
        this.emitFiles();
       
      }
    );

  }

  emitFiles() {
    const files = Array.from(this.files.values()).map((f: FileData) => f.file);
    this.added.emit(files);
  }

  ngOnInit(): void {
    this.reset$?.subscribe(
      () => {
        this.files.clear();
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.guid) {
      this.refresh.next(true);
    }
  }

  delete(imgKey: string): void {
    this.combineSize -= (this.files.get(imgKey)?.file.size ?? 0)
    this.files.delete(imgKey);
    this.emitFiles();
  }

  //
  // Handle component events
  //
  filesSelected(ev: any): void {
    this.drops.next(ev.target.files);
  }

  focus(img: any): void {
    this.activeImage = img;
  }

  blur(img: any): void {
    this.activeImage = null;
  }

  // for maintaining insertion order of set 
  insertOrder() {
    return 0;
  }

  //
  // Handle drag/drop events
  //
  @HostListener('dragenter', ['$event'])
  @HostListener('dragover', ['$event'])
  onEnter(event: DragEvent): boolean {
    this.dropzone = true;
    return false;
  }
  @HostListener('dragleave', ['$event'])
  @HostListener('dragexit', ['$event'])
  onLeave(event: DragEvent): boolean {
    this.dropzone = false;
    return false;
  }
  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): boolean {
    this.dropzone = false;
    this.drops.next(event.dataTransfer?.files);
    return false;
  }
}


export interface FileData {
  file: File;
  encoded?: SafeResourceUrl;
}
