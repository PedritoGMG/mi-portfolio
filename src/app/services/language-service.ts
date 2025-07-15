import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Language {
  code: string;
  name: string;
  flagUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly availableLanguages: Language[] = [
    { code: 'es', name: 'Español', flagUrl: 'https://flagpedia.net/data/flags/icon/256x192/es.webp' },
    { code: 'en', name: 'English', flagUrl: 'https://flagpedia.net/data/flags/icon/256x192/gb.webp' }
  ];

  currentLanguage = signal<Language>(this.availableLanguages[0]);

  constructor(private readonly translate: TranslateService) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    
    if (savedLanguage) {
      const lang = this.availableLanguages.find(l => l.code === savedLanguage);
      if (lang) {
        this.setLanguage(lang);
        return;
      }
    }

    const browserLang = this.translate.getBrowserLang();
    const defaultLang = this.availableLanguages.find(l => l.code === browserLang) || this.availableLanguages[0];
    
    this.setLanguage(defaultLang);
  }

  getLanguages(): Language[] {
    return this.availableLanguages;
  }

  setLanguage(language: Language): void {
    this.translate.use(language.code);
    this.currentLanguage.set(language);
    localStorage.setItem('preferredLanguage', language.code);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage();
  }

  setLanguageByCode(code: string): void {
    const language = this.availableLanguages.find(l => l.code === code);
    if (language) {
      this.setLanguage(language);
    }
  }
}
