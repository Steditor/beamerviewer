import { Component, Input, OnInit } from '@angular/core';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { Presentation } from '../presentation';

@Component({
  selector: 'app-preview-slides',
  templateUrl: './preview-slides.component.html',
  styleUrls: ['./preview-slides.component.scss']
})
export class PreviewSlidesComponent implements OnInit {

  @Input()
  document: PDFDocumentProxy;

  @Input()
  currentSlide: number;

  constructor() {
  }

  ngOnInit() {
  }

}
