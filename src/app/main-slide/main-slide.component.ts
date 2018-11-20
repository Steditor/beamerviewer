import { Component, HostListener, Input, OnDestroy, ViewChild } from '@angular/core';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { DisplayMode, DisplayModeService } from '../display-mode.service';
import { PageNumberService } from '../page-number.service';
import { PdfviewComponent } from '../pdfpage/pdfview.component';

@Component({
  selector: 'app-main-slide',
  templateUrl: './main-slide.component.html',
  styleUrls: ['./main-slide.component.scss']
})
export class MainSlideComponent implements OnDestroy {

  @ViewChild('mainViewer')
  mainViewer: PdfviewComponent;
  @Input()
  document: PDFDocumentProxy;
  @Input()
  private slide: number;

  private fullscreenQuery;

  constructor(private pageNumberService: PageNumberService, private displayModeService: DisplayModeService) {
    this.fullscreenQuery = matchMedia('all and (display-mode: fullscreen)');
    this.fullscreenQuery.addListener(e => this.onFullscreenChange(e));
  }

  ngOnDestroy() {
    this.fullscreenQuery.removeAllListeners();
  }

  gotoFullscreen() {
    this.mainViewer.gotoFullscreen();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.displayModeService.mode = DisplayMode.PRESENTATION;
  }

  exitFullscreen() {
    this.mainViewer.exitFullscreen();
    this.displayModeService.mode = DisplayMode.SPEAKER;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event) {
    switch (event.key) {
      case 'Escape':
        this.exitFullscreen();
        break;
    }
  }

  private onFullscreenChange(e) {
    if (!this.fullscreenQuery.matches) {
      this.exitFullscreen();
    }
  }
}
