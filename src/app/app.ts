import { Component, signal, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { TranslateService, TranslateDirective } from '@ngx-translate/core';
import { BackgroundComponent } from './background/background';
import { Carousel } from 'bootstrap';
import { Presentation } from './presentation/presentation';
import { Skills } from "./skills/skills";
import { Contact } from "./contact/contact";
import { Projects } from "./projects/projects";
import { LanguageService } from './services/language-service';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    BackgroundComponent,
    Presentation,
    Skills,
    Contact,
    Projects,
    TranslateDirective,
    UpperCasePipe
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  
  protected readonly title = signal('mi-portfolio');
  private translate = inject(TranslateService);
  languageService = inject(LanguageService);

  @ViewChild('carousel') carouselElement!: ElementRef;
  private carousel!: Carousel;

  constructor() {
    this.translate.addLangs(this.languageService.getLanguages().map(l => l.code));
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

  ngAfterViewInit(): void {
    this.carousel = new Carousel(this.carouselElement.nativeElement, {
      interval: false
    });

    this.setupScrollSpy();

    const container = document.querySelector('.info_container') as HTMLElement;

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const newHeight = entry.contentRect.height;
        container.style.height = newHeight + 'px';
      }
    });

    if (this.carousel) {
      observer.observe(this.carouselElement.nativeElement);
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  private setupScrollSpy(): void {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1);
        if (!targetId) return;

        const targetSlide = document.getElementById(targetId);
        if (!targetSlide) return;

        const slides = Array.from(targetSlide.parentElement!.children);
        const index = slides.indexOf(targetSlide);
        
        this.carousel.to(index);
      });
    });

    this.carouselElement.nativeElement.addEventListener('slid.bs.carousel', (event: any) => {
      const activeSlideId = event.relatedTarget.id;
      
      document.querySelectorAll('.nav-link').forEach(navLink => {
        navLink.classList.remove('active');
        if (navLink.getAttribute('href') === `#${activeSlideId}`) {
          navLink.classList.add('active');
        }
      });
    });
  }
}