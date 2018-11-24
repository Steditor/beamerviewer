import { NgModule } from '@angular/core';

import { MatButtonModule, MatCardModule, MatDividerModule, MatToolbarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronLeft,
  faChevronRight,
  faDesktop,
  faPause,
  faPlay,
  faSpinner,
  faUndo,
  faWindowClose
} from '@fortawesome/free-solid-svg-icons';

import { AppComponent } from './app.component';
import { DisplayModeService } from './display-mode.service';
import { FileDropDirective } from './file-selector/file-drop.directive';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { MainSlideComponent } from './main-slide/main-slide.component';
import { PageControlDirective } from './page-control.directive';
import { PageNumberService } from './page-number.service';
import { PdfpageComponent } from './pdfpage/pdfpage.component';
import { PdfviewComponent } from './pdfpage/pdfview.component';
import { PresentationTimerComponent } from './presentation-timer/presentation-timer.component';
import { PresentationService } from './presentation.service';
import { PreviewSlidesComponent } from './preview-slides/preview-slides.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

// Add an icon to the library for convenient access in other components
library.add(faChevronLeft, faChevronRight, faDesktop, faPause, faPlay, faSpinner, faUndo, faWindowClose);

@NgModule({
  declarations: [
    AppComponent,
    PageControlDirective,
    FileDropDirective,
    FileSelectorComponent,
    PdfpageComponent,
    PdfviewComponent,
    MainSlideComponent,
    ToolbarComponent,
    PreviewSlidesComponent,
    PresentationTimerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatToolbarModule,
  ],
  providers: [
    PresentationService,
    PageNumberService,
    DisplayModeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
