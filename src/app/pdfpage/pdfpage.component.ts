import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { PDFPageProxy, PDFRenderParams, PDFRenderTask } from 'pdfjs-dist';

@Component({
  selector: 'app-pdfpage',
  templateUrl: './pdfpage.component.html',
  styleUrls: ['./pdfpage.component.scss']
})
export class PdfpageComponent implements AfterViewInit, OnChanges {
  @Input()
  width: number;
  @Input()
  height: number;

  @Input()
  private page: PDFPageProxy = null;

  @ViewChild('canvas')
  private canvas: ElementRef<HTMLCanvasElement> = null;
  private context: CanvasRenderingContext2D = null;

  private isRendering: boolean = false;
  private isRenderingQueued: boolean = false;
  private renderTask: PDFRenderTask = null;

  ngAfterViewInit() {
    this.context = this.canvas.nativeElement.getContext('2d');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['page'] || changes['width'] || changes['height']) {
      this.requestRendering();
    }
  }

  private async requestRendering() {
    if (!this.page || !this.context) {
      return;
    }

    this.isRenderingQueued = true;
    if (this.isRendering) {
      return;
    }

    this.isRendering = true;
    while (this.isRenderingQueued) {
      this.isRenderingQueued = false;
      if (this.renderTask) {
        this.renderTask.cancel();
        await this.awaitRenderTask();
        this.renderTask = null;
      }
      if (!this.isRenderingQueued) {
        this.clear();
        this.render();
        await this.awaitRenderTask();
      }
    }
    this.isRendering = false;
  }

  private clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  private render() {
    const viewport = this.page.getViewport(1);
    const scaleX = this.width / viewport.width;
    const scaleY = this.height / viewport.height;
    const scaledViewport = this.page.getViewport(Math.min(scaleX, scaleY));
    const offsetX = (this.width - scaledViewport.width) / 2;
    const offsetY = (this.height - scaledViewport.height) / 2;
    this.context.fillStyle = 'white';
    this.context.fillRect(offsetX, offsetY, scaledViewport.width, scaledViewport.height);
    this.renderTask = this.page.render({
      canvasContext: this.context,
      viewport: scaledViewport,
      transform: [1, 0, 0, 1, offsetX, offsetY],
      background: 'rgba(0,0,0,0)',
    });
  }

  private async awaitRenderTask() {
    try {
      await this.renderTask;
    } catch (error) {
      if (error.message.startsWith('Rendering cancelled')) {
        return;
      } else {
        throw Error;
      }
    }
  }
}

// Missing declaration in pdfjs-dist types
declare module 'pdfjs-dist' {
  interface PDFRenderParams {
    transform?: number[];
    background?: string;
  }
}
