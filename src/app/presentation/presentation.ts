import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import Typed from 'typed.js';

@Component({
  selector: 'app-presentation',
  imports: [TranslatePipe, TranslateDirective],
  templateUrl: './presentation.html',
  styleUrl: './presentation.scss'
})
export class Presentation implements AfterViewInit {

  @ViewChild('typed', { static: true }) typedTextElement!: ElementRef;
  currentImage: string = 'assets/images/yo.png';
  images: string[] = [
    'assets/images/yo.png',
    'https://avatars.githubusercontent.com/u/146210335?v=4'
  ];

  ngAfterViewInit(): void {
    const options = {
      strings: [
        "Pedro Manuel",
        "PedritoGMG"
    ],
      typeSpeed: 75,
      backSpeed: 50,
      backDelay: 3000,
      startDelay: 500,
      loop: true,
      onStringTyped: (arrayPos: number) => {
        this.changeImage(arrayPos);
      }
    };

    new Typed(this.typedTextElement.nativeElement, options);
  }

  changeImage(index: number): void {
    const imgEl = document.querySelector('.logo') as HTMLImageElement;
    if (!imgEl || this.images[index] === this.currentImage) return;

    imgEl.classList.add('fade-out');
    imgEl.classList.remove('fade-in');

    const transitionDuration = 500;
    let fallback: ReturnType<typeof setTimeout>;

    const onTransitionEnd = () => {
      clearTimeout(fallback);
      this.currentImage = this.images[index];
      imgEl.classList.remove('fade-out');
      imgEl.classList.add('fade-in');
    };

    imgEl.addEventListener('transitionend', onTransitionEnd, { once: true });

    fallback = setTimeout(onTransitionEnd, transitionDuration);
  }
}
