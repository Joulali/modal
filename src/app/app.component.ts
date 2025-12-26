import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalService } from './modal/modal.service';
import { ModalComponent } from './modal/modal.component';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  imports: [ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private modalService = inject(ModalService);
  private themeService = inject(ThemeService);

  openModal(modal_id: string): void {
    this.modalService.open(modal_id);
  }

  closeModal(id: string): void {
    this.modalService.close(id);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
