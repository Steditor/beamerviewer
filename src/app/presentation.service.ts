import { Injectable } from '@angular/core';

import * as localforage from 'localforage';
import { PDFJSStatic } from 'pdfjs-dist';
import * as PDFJS_ from 'pdfjs-dist/webpack';
import { PageNumberService } from './page-number.service';
import { Presentation } from './presentation';

const PDFJS: PDFJSStatic = PDFJS_;

@Injectable({
  providedIn: 'root'
})
export class PresentationService {
  presentation: Presentation = null;

  constructor(private pageNumberService: PageNumberService) {
    localforage.setDriver(localforage.INDEXEDDB);
    this.loadPresentationFromStorage();
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === 'presentation') {
        this.loadPresentationFromStorage();
      }
    });
  }

  public async usePresentation(presentation: Presentation): Promise<void> {
    this.storePresentation(presentation);
    this.presentation = presentation;
    this.pageNumberService.reset();
    await this.loadDocument();
    return;
  }

  public async deletePresentation(): Promise<void> {
    await localforage.removeItem('presentation.name');
    await localforage.removeItem('presentation.file');
    this.presentation = null;
    localStorage.setItem('presentation', String(Date.now())); // Trigger reload in other windows
    this.pageNumberService.reset();
    return;
  }

  private async loadPresentationFromStorage(): Promise<Presentation | null> {
    const p = new Presentation();
    p.name = await localforage.getItem<string>('presentation.name');
    p.file = await localforage.getItem<ArrayBuffer>('presentation.file');
    if (p.name === null || p.file === null) {
      this.presentation = null;
      return null;
    } else {
      this.presentation = p;
      await this.loadDocument();
      return p;
    }
  }

  private async storePresentation(presentation: Presentation): Promise<void> {
    await localforage.setItem<string>('presentation.name', presentation.name);
    await localforage.setItem<ArrayBuffer>('presentation.file', presentation.file);
    localStorage.setItem('presentation', String(Date.now())); // Trigger reload in other windows
  }

  private async loadDocument() {
    this.presentation.document = await PDFJS.getDocument(new Uint8Array(this.presentation.file));
    this.pageNumberService.setLastPage(this.presentation.document.numPages);
  }
}
