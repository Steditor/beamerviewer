import { Component } from '@angular/core';
import { DisplayModeService } from './display-mode.service';
import { PageNumberService } from './page-number.service';
import { PresentationService } from './presentation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public presentationService: PresentationService,
              public pageNumberService: PageNumberService,
              public displayModeService: DisplayModeService) {
  }
}
