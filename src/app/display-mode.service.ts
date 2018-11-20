import { Injectable } from '@angular/core';

export enum DisplayMode {
  SPEAKER,
  PRESENTATION
}

@Injectable({
  providedIn: 'root'
})
export class DisplayModeService {
  mode: DisplayMode = DisplayMode.SPEAKER;

  modes = DisplayMode;

  constructor() {
  }
}
