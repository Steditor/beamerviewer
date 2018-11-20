import { Component } from '@angular/core';
import { PresentationService } from '../presentation.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  constructor(public presentationService: PresentationService) {
  }
}
