import { Component } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-projects',
  imports: [TranslatePipe, TranslateDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  
  projects: Project[] = [
  {
    key: 'transfernow',
    title: "TransferNow - Sistema FTP",
    description: "Recreación de un sistema FTP con Spring. Tiene un sistema para poder organizar y gestionar los archivos que quieres subir y te da la posibilidad de compartir estos mediantes puertos abiertos a parte de poder aceptar solicitudes de archivos de usuarios externos.",
    image: "assets/projects/TransferNow.png",
    technologies: [
      { name: "Spring", icon: "spring.svg" },
      { name: "H2 Database", icon: "h2.png" },
      { name: "Angular", icon: "angular.svg" },
      { name: "Bootstrap", icon: "bootstrap5.svg" }
    ],
    link: "https://github.com/PedritoGMG/TransferNow"
  },
  {
    key: 'rutas_cda',
    title: "RutasCdA - App",
    description: "App en la que los usuarios siguen rutas físicas usando geolocalización, escanean códigos QR en los lugares y resuelven enigmas. Todo almacenado en la nube dejando un registro activo del progreso del usuario.",
    image: "assets/projects/rutas.png",
    technologies: [
      { name: "Android Studio", icon: "android.svg" },
      { name: "PHP", icon: "php.svg" },
      { name: "MySQL", icon: "mysql.svg" }
    ],
    link: "https://github.com/PedritoGMG/RutasCdA"
  },
  {
    key: 'library_web',
    title: "Gestión de Librería Web",
    description: "Aplicación web para gestionar libros, categorías y autores mediante operaciones CRUD completas con ASP.NET. Incluye un sistema de login con roles y permisos para diferenciar administradores de usuarios, garantizando un control de acceso seguro y eficiente.",
    image: "assets/projects/Libreria.png",
    technologies: [
      { name: "ASP.NET", icon: "c-sharp.svg" },
      { name: "Angular", icon: "angular.svg" },
      { name: "MySQL", icon: "mysql.svg" }
    ],
    link: "https://github.com/PedritoGMG/LibreriaPM"
  }
];

}
interface Project {
  key: string;
  title: string;
  description: string;
  image: string;
  technologies: { name: string; icon: string }[];
  link: string;
}