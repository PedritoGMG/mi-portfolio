import { Component } from '@angular/core';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  imports: [TranslatePipe, TranslateDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  email = 'pmgalann01.dev@gmail.com';
  copied = false;

  copyEmail() {
    navigator.clipboard.writeText(this.email).then(() => {
      this.showSuccess();
    }).catch(err => {
      this.fallbackCopyText(this.email);
    });
  }

  private showSuccess() {
    this.copied = true;
    
    setTimeout(() => {
      this.copied = false;
    }, 2000);
  }

  private fallbackCopyText(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    this.showSuccess();
  }
}
