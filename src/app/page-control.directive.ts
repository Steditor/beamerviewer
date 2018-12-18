import { Directive, HostListener } from '@angular/core';
import { PageNumberService } from './page-number.service';

@Directive({
  selector: '[appPageControl]'
})
export class PageControlDirective {

  switchPageTarget: number = 0;
  switchPageAction: Date = new Date(0);

  constructor(private pageNumberService: PageNumberService) {
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    event.preventDefault();
  }

  @HostListener('window:keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    event.preventDefault();
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    event.preventDefault();
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
      case ' ':
        this.pageNumberService.nextPage();
        this.switchPageTarget = 0;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        this.pageNumberService.previousPage();
        this.switchPageTarget = 0;
        break;
      case 'Enter': {
        const time = new Date();
        const timePassed = time.getTime() - this.switchPageAction.getTime();
        if (timePassed < 2000 && this.switchPageTarget !== 0) {
          this.pageNumberService.gotoPage(this.switchPageTarget);
        } else {
          this.pageNumberService.nextPage();
          this.switchPageTarget = 0;
        }
        this.switchPageTarget = 0;
        break;
      }
      default:
        if (isFinite(parseInt(event.key, 10))) {
          const time = new Date();
          const timePassed = time.getTime() - this.switchPageAction.getTime();
          if (timePassed > 1000) {
            this.switchPageTarget = 0;
          }

          this.switchPageTarget *= 10;
          this.switchPageTarget += parseInt(event.key, 10);
          this.switchPageAction = time;
        }
    }
  }
}
