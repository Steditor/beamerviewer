import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageNumberService {
  page: number = 1;
  lastPage: number = null;

  constructor() {
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === 'page' || event.key === 'presentation') {
        this.parseLocalStorage();
        this.emitPage();
      }
    });
    this.parseLocalStorage();
    this.emitPage();
  }

  nextPage() {
    this.page++;
    this.emitPage();
  }

  previousPage() {
    this.page--;
    this.emitPage();
  }

  gotoPage(page: number) {
    this.page = page;
    this.emitPage();
  }

  reset() {
    this.page = 1;
    this.lastPage = null;
    this.emitPage();
  }

  isValid(page: number): boolean {
    return page > 0 && (this.lastPage === null || page <= this.lastPage);
  }

  setLastPage(num: number) {
    this.lastPage = num;
  }

  private parseLocalStorage() {
    const storedPage = localStorage.getItem('page');
    if (storedPage) {
      this.page = parseInt(storedPage, 10);
    }
  }

  private emitPage() {
    this.page = Math.max(1, this.page);
    if (this.lastPage !== null && this.page > this.lastPage) {
      this.page = this.lastPage;
    }
    localStorage.setItem('page', String(this.page));
  }
}
