import {
  Component,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationEvent } from '@angular/animations';

import { ModalService } from './modal.service';
import { BACKDROP_ANIMATION, MODAL_ANIMATION } from './modal.animations';

@Component({
  standalone: true,
  selector: 'app-modal',
  imports: [CommonModule],
  template: `
    <div
      class="pop-modal {{ size }}"
      [@modalAnimation]="state"
      (@modalAnimation.done)="onAnimationDone($event)"
    >
      <div class="pop-modal-body">
        <ng-content />
      </div>
    </div>

    <div class="pop-modal-background" [@backdropAnimation]="state"></div>
  `,
  animations: [MODAL_ANIMATION, BACKDROP_ANIMATION],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input({ required: true }) id!: string;
  @Input() size: 'small' | 'large' | 'extra-large' = 'large';

  state: 'show' | 'hide' = 'hide';
  private isClosing = false;

  private modalService = inject(ModalService);
  private el = inject(ElementRef<HTMLElement>);

  private element = this.el.nativeElement;

  ngOnInit(): void {
    if (!this.id) {
      console.error('Modal must have an id');
      return;
    }

    document.body.appendChild(this.element);

    this.element.addEventListener('click', (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.pop-modal') === this.element) {
        this.close();
      }
    });

    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }

  open(): void {
    this.element.style.display = 'block';
    document.body.classList.add('pop-modal-open');
    this.state = 'show';
  }

  close(): void {
    this.state = 'hide';
    this.isClosing = true;
    document.body.classList.remove('pop-modal-open');
  }

  onAnimationDone(event: AnimationEvent): void {
    if (this.isClosing && event.toState.includes('hide')) {
      this.element.style.display = 'none';
      this.isClosing = false;
    }
  }
}
