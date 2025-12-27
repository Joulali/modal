import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalService } from './modal/modal.service';
import { ModalComponent } from './modal/modal.component';
import { Subscription } from 'rxjs';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, MainContentComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isSidebarCollapsed = false;

  // Handle sidebar collapse event from sidebar component
  onSidebarCollapsed(isCollapsed: boolean) {
    this.isSidebarCollapsed = isCollapsed;
  }

  toggleMobileSidebar() {
    // This method will be called from navbar to toggle mobile sidebar
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 992) {
      sidebar?.classList.toggle('mobile-open');
    }
  }
}
