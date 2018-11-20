import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import fscreen from 'fscreen';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { PageNumberService } from '../page-number.service';

enum SpecialPage {
  WHITE, BLACK
}

class PdfPage {
  page: PDFPageProxy = null;
  slide: number = null;
}

type Page = SpecialPage | PdfPage;

interface Size {
  width: number;
  height: number;
}

@Component({
  selector: 'app-pdfview',
  templateUrl: './pdfview.component.html',
  styleUrls: ['./pdfview.component.scss']
})
export class PdfviewComponent implements OnInit, OnChanges {
  @Input()
  private slide: number;
  private isLoadingQueued: boolean = false;
  private isLoading: boolean = false;

  @Input()
  private document: PDFDocumentProxy;

  @Input()
  private width: number = 450;

  @ViewChild('wrapper')
  private wrapper;
  wrapperSize: Size = {width: 0, height: 0};

  readonly pdfPage1: PdfPage = null;
  readonly pdfPage2: PdfPage = null;
  private lastPdfPage: PdfPage;
  displaySize: Size = {width: 0, height: 0};

  readonly SP = SpecialPage;
  activePage: Page;

  constructor(private pageNumberService: PageNumberService) {
    this.pdfPage1 = new PdfPage();
    this.pdfPage2 = new PdfPage();
  }

  ngOnInit() {
    this.resize();
    fscreen.onfullscreenchange = () => {
      if (fscreen.fullscreenElement === null) {
        this.exitFullscreen();
      }
    };
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['document'] || changes['slide']) {
      this.requestSlide();
    }
    if (changes['width']) {
      this.resize();
    }
  }

  toggleWhitePage() {
    if (this.activePage !== SpecialPage.WHITE) {
      this.setActivePage(SpecialPage.WHITE);
    } else {
      this.showLastPdfPage();
    }
  }

  toggleBlackPage() {
    if (this.activePage !== SpecialPage.BLACK) {
      this.setActivePage(SpecialPage.BLACK);
    } else {
      this.showLastPdfPage();
    }
  }

  showLastPdfPage() {
    this.setActivePage(this.lastPdfPage);
  }

  async gotoFullscreen() {
    fscreen.requestFullscreen(this.wrapper.nativeElement);
    await this.wait(10); // give browser a chance to go into fullscreen before scaling
    this.displaySize.width = window.screen.width;
    this.displaySize.height = window.screen.height;
  }

  exitFullscreen() {
    fscreen.exitFullscreen();
    this.displaySize.width = this.wrapperSize.width;
    this.displaySize.height = this.wrapperSize.height;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event) {
    switch (event.key) {
      case 'w':
        event.preventDefault();
        this.toggleWhitePage();
        break;
      case 'b':
        event.preventDefault();
        this.toggleBlackPage();
        break;
    }
  }

  private resize() {
    this.wrapperSize.width = this.width;
    this.wrapperSize.height = this.width * window.screen.height / window.screen.width;
    this.displaySize.width = this.wrapperSize.width;
    this.displaySize.height = this.wrapperSize.height;
  }

  private async requestSlide() {
    this.isLoadingQueued = true;
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    while (this.isLoadingQueued) {
      this.isLoadingQueued = false;
      await this.showSlide();
    }
    this.isLoading = false;
  }

  private async showSlide() {
    const background = this.activePage === this.pdfPage1 ? this.pdfPage2 : this.pdfPage1;
    const oldForeground = background === this.pdfPage1 ? this.pdfPage2 : this.pdfPage1;

    await this.loadSlide(this.slide, background);
    this.setActivePage(background);
    if (!this.isLoadingQueued) {
      await this.wait(400);
    }
    if (!this.isLoadingQueued) {
      await this.loadSlide(this.slide + 1, oldForeground);
    }
  }

  private async loadSlide(slide: number, page: PdfPage) {
    if (page.slide !== slide && this.pageNumberService.isValid(slide) && this.document) {
      page.slide = slide;
      page.page = await this.document.getPage(slide);
    }
  }

  private setActivePage(page: Page) {
    this.activePage = page;

    if (this.activePage === this.pdfPage1 || this.activePage === this.pdfPage2) {
      this.lastPdfPage = this.activePage;
    }
  }

  private async wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}
