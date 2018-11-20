import { PDFDocumentProxy } from 'pdfjs-dist';

export class Presentation {
  name: string;
  file: ArrayBuffer;
  document: PDFDocumentProxy;
}
