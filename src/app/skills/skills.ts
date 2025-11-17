import { Component } from '@angular/core';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';

@Component({
  selector: 'app-skills',
  imports: [TranslatePipe, TranslateDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.scss'
})
export class Skills {

  technologies = [
    {
      key: 'java_android',
      items: [
        { name: 'Java', icon: 'java.svg' },
        { name: 'Spring', icon: 'spring.svg' },
        { name: 'Android Studio', icon: 'android.svg' }
      ]
    },
    {
      key: 'web',
      items: [
        { name: 'HTML', icon: 'html5.svg' },
        { name: 'CSS', icon: 'css3.svg' },
        { name: 'Bootstrap', icon: 'bootstrap5.svg' },
        { name: 'Angular', icon: 'angular.svg' },
        { name: 'TypeScript', icon: 'typescript.svg' }
      ]
    },
    {
      key: 'databases',
      items: [
        { name: 'MySQL', icon: 'mysql.svg' },
        { name: 'MariaDB', icon: 'mariadb.svg' },
        { name: 'PostgreSQL', icon: 'postgresql.svg' },
        { name: 'MongoDB', icon: 'mongodb.svg' }
      ]
    },
    {
      key: 'tools',
      items: [
        { name: 'Git', icon: 'git.svg' },
        { name: 'Photoshop', icon: 'photoshop.svg' },
        { name: 'VSCode', icon: 'vscode.svg' },
        { name: 'Postman', icon: 'postman.svg' },
        { name: 'Bash', icon: 'bash.svg' },
        { name: 'Docker', icon: 'docker.svg' },
      ]
    }
  ];


}