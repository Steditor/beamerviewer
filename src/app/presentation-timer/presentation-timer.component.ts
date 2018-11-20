import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-presentation-timer',
  templateUrl: './presentation-timer.component.html',
  styleUrls: ['./presentation-timer.component.scss']
})
export class PresentationTimerComponent implements OnInit, OnDestroy {

  private startTime: number = 0;
  hours: string = '00';
  minutes: string = '00';
  seconds: string = '00';
  private timeout: number = null;

  ngOnInit() {
    this.reset();
  }

  ngOnDestroy() {
    window.clearInterval(this.timeout);
  }

  reset() {
    this.startTime = Date.now();
    this.update();
    if (this.timeout) {
      window.clearInterval(this.timeout);
    }
    this.timeout = window.setInterval(() => this.update(), 1000);
  }

  private update() {
    let seconds = Math.floor((Date.now() - this.startTime) / 1000);
    const hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    this.hours = (`0${hours}`).substr(-2, 2);
    this.minutes = (`0${minutes}`).substr(-2, 2);
    this.seconds = (`0${seconds}`).substr(-2, 2);
  }
}
