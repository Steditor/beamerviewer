import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-presentation-timer',
  templateUrl: './presentation-timer.component.html',
  styleUrls: ['./presentation-timer.component.scss']
})
export class PresentationTimerComponent implements OnInit, OnDestroy {

  private startTime: number = 0;
  pauseTime: number = null;
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
    if (this.pauseTime) {
      this.pauseTime = Date.now();
    }
    this.update();
    if (this.timeout) {
      window.clearInterval(this.timeout);
    }
    if (!this.pauseTime) {
      this.timeout = window.setInterval(() => this.update(), 1000);
    }
  }

  pause() {
    if (this.timeout) {
      window.clearInterval(this.timeout);
      this.timeout = null;
    }
    if (this.pauseTime) {
      const pausedFor = Date.now() - this.pauseTime;
      this.pauseTime = null;
      this.startTime += pausedFor;
      this.timeout = window.setInterval(() => this.update(), 1000);
    } else {
      this.pauseTime = Date.now();
    }
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
