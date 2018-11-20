import { Component, Input } from '@angular/core';
import { FileDropState } from './file-drop.directive';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.scss']
})
export class FileSelectorComponent {
  @Input()
  state: FileDropState = FileDropState.DEFAULT;

  states = FileDropState;
}
