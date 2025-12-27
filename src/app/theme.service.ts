import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export type ThemeName = 'default' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'app_theme';
  private readonly DEFAULT: ThemeName = 'default';
  private readonly DARK: ThemeName = 'dark';
  private readonly THEME_ATTR = 'data-theme';

  private themeSubject = new BehaviorSubject<ThemeName>(this.DEFAULT);
  public themeChanges$: Observable<ThemeName> = this.themeSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeTheme();
  }

  /** Get current theme (server-side safe) */
  get theme(): ThemeName {
    if (!isPlatformBrowser(this.platformId)) {
      return this.DEFAULT;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored === this.DARK || stored === this.DEFAULT
        ? (stored as ThemeName)
        : this.DEFAULT;
    } catch {
      return this.DEFAULT;
    }
  }

  /** Set theme with persistence and visual update */
  set theme(name: ThemeName) {
    if (!isPlatformBrowser(this.platformId)) return;

    // Update DOM
    document.documentElement.setAttribute(this.THEME_ATTR, name);

    // Persist with error handling
    try {
      localStorage.setItem(this.STORAGE_KEY, name);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }

    // Notify subscribers
    this.themeSubject.next(name);
  }

  /** Toggle between themes */
  toggle(): void {
    this.theme = this.theme === this.DARK ? this.DEFAULT : this.DARK;
  }

  /** Check if dark theme is active */
  get isDarkTheme(): boolean {
    return this.theme === this.DARK;
  }

  /** Initialize theme on app start */
  private initializeTheme(): void {
    // Apply the theme on initialization
    const currentTheme = this.theme;
    this.themeSubject.next(currentTheme);

    if (isPlatformBrowser(this.platformId)) {
      // Apply theme attribute
      document.documentElement.setAttribute(this.THEME_ATTR, currentTheme);

      // Listen for storage events to sync across tabs
      window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === this.STORAGE_KEY) {
          this.applyThemeFromStorage(event.newValue);
          // Also update subject for consistency
          if (event.newValue === this.DARK || event.newValue === this.DEFAULT) {
            this.themeSubject.next(event.newValue as ThemeName);
          }
        }
      });
    }
  }

  /** Apply theme from storage value */
  private applyThemeFromStorage(value: string | null): void {
    if (value === this.DARK || value === this.DEFAULT) {
      document.documentElement.setAttribute(this.THEME_ATTR, value);
    }
  }
}
