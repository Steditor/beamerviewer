import { Component, Input, OnInit } from '@angular/core';
import { Presentation } from '../presentation';

@Component({
  selector: 'app-preview-slides',
  templateUrl: './preview-slides.component.html',
  styleUrls: ['./preview-slides.component.scss']
})
export class PreviewSlidesComponent implements OnInit {

  @Input()
  private presentation: Presentation;

  @Input()
  currentSlide: number;

  constructor() {
  }

  ngOnInit() {
  }

}
