import { Directive, HostListener } from '@angular/core';
import { Presentation } from '../presentation';
import { PresentationService } from '../presentation.service';

export enum FileDropState {
  NOT_A_FILE,
  MULTIPLE_FILES,
  NOT_A_PDF,
  DROP_NOW,
  LOADING,
  DEFAULT
}

@Directive({
  selector: '[appFileDrop]',
  exportAs: 'fileDrop'
})
export class FileDropDirective {
  state: FileDropState = FileDropState.DEFAULT;
  states = FileDropState;

  constructor(public presentationService: PresentationService) {
  }

  @HostListener('window:dragenter', ['$event'])
  @HostListener('window:dragover', ['$event'])
  onDragEnter(event) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer.types.includes('Files')) {
      dataTransfer.dropEffect = 'none';
      this.state = FileDropState.NOT_A_FILE;
      return;
    }
    if (dataTransfer.items.length > 1) {
      dataTransfer.dropEffect = 'none';
      this.state = FileDropState.MULTIPLE_FILES;
      return;
    }
    dataTransfer.dropEffect = 'copy';
    this.state = FileDropState.DROP_NOW;
  }

  @HostListener('window:dragleave', ['$event'])
  @HostListener('window:dragexit', ['$event'])
  onDragLeave(event) {
    event.preventDefault();
    this.state = FileDropState.DEFAULT;
  }

  @HostListener('window:drop', ['$event'])
  async onDrop(event) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer.types.includes('Files')) {
      this.state = FileDropState.NOT_A_FILE;
      return;
    }
    if (dataTransfer.items.length > 1) {
      this.state = FileDropState.MULTIPLE_FILES;
      return;
    }
    const file = dataTransfer.files[0];
    if (!file.name.endsWith('.pdf')) {
      this.state = FileDropState.NOT_A_PDF;
      if (this.presentationService.presentation) {
        window.setTimeout(() => this.state = FileDropState.DEFAULT, 3000);
      }
      return;
    }

    this.state = FileDropState.LOADING;
    await this.presentationService.usePresentation(await this.readFile(file));
    this.state = FileDropState.DEFAULT;
  }

  private readFile(file: File): Promise<Presentation> {
    const reader = new FileReader();
    const p = new Presentation();
    p.name = file.name;

    return new Promise((resolve, reject) => {
        reader.onload = (e) => {
          if (reader.result instanceof ArrayBuffer) { // needed for TS type checking
            p.file = reader.result;
            resolve(p);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      }
    );
  }
}
