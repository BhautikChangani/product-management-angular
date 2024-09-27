import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-apply-all-popover',
  template: `
    <div class="popover">
      <button (click)="applyAll()">Apply All</button>
    </div>
  `,
  styles: [`
    .popover {
      position: absolute;
      background: white;
      border: 1px solid #ccc;
      padding: 10px;
      z-index: 1000;
    }
  `]
})
export class ApplyAllPopoverComponent {
  @Input() value: string = '';
  @Output() apply = new EventEmitter<string>();

  applyAll() {
    this.apply.emit(this.value);
  }
}
