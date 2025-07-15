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

  ngAfterViewInit(): void {
    const options = {
      strings: [
        "Pedro Manuel",
        "PedritoGMG"
    ],
      typeSpeed: 75,
      backSpeed: 50,
      loop: true
    };

    new Typed(this.typedTextElement.nativeElement, options);
  }
}
