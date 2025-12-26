import { Injectable } from '@angular/core';

export type ThemeName = 'default' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly DEFAULT = 'default';
  private readonly DARK = 'dark';

  get theme(): string {
    return document.documentElement.getAttribute('theme') ?? this.DEFAULT;
  }

  set theme(name: string) {
    document.documentElement.setAttribute('theme', name);
  }

  toggle(): void {
    this.theme = this.theme === this.DARK ? this.DEFAULT : this.DARK;
  }
}
