import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ViewChild,
  NgZone
} from '@angular/core';
import { createNoise2D } from 'simplex-noise';
import { loadSlim } from 'tsparticles-slim';
import { Engine, tsParticles } from 'tsparticles-engine';

@Component({
  selector: 'app-background',
  templateUrl: './background.html',
  styleUrls: ['./background.scss']
})
export class BackgroundComponent implements AfterViewInit, OnDestroy {
  private noiseZ = 0;
  private readonly baseSize = 15; // <-- Tamaño base inmutable
  private size = this.baseSize;

  private columns = 0;
  private rows = 0;
  private w = 0;
  private h = 0;

  private field: number[][][] = [];
  private animationFrameId: number | null = null;
  private noise2D = createNoise2D();

  private particlesInitialized = false;
  private lastFrameTime = 0;
  private frameInterval = 1000 / 30; // 30 FPS
  private resizeObserver: ResizeObserver | null = null;
  private resizeTimeout: any;
  private lastResizeTime = 0;

  @ViewChild('field') fieldCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  async ngAfterViewInit(): Promise<void> {
    requestAnimationFrame(() => {
      this.setup();
      this.initParticles();
      this.setupResizeObserver();
    });
  }

  ngOnDestroy(): void {
    this.cleanUp();
  }

  private cleanUp(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    tsParticles.dom().forEach(container => container.destroy());
    this.particlesInitialized = false;

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.throttleResize(); // <-- Siempre aplicamos el resize
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      this.throttleResize();
    });

    if (this.fieldCanvas?.nativeElement) {
      this.resizeObserver.observe(this.fieldCanvas.nativeElement);
    }
  }

  private throttleResize(): void {
    const now = performance.now();
    if (now - this.lastResizeTime < 200) return;

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.lastResizeTime = now;
      this.reset();
      this.resizeTimeout = null;
    }, 50);
  }

  private setup(): void {
    this.reset();
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }

  private reset(): void {
    const canvasField = this.fieldCanvas.nativeElement;
    const pxRatio = window.devicePixelRatio || 1;

    this.w = canvasField.offsetWidth * pxRatio;
    this.h = canvasField.offsetHeight * pxRatio;
    canvasField.width = this.w;
    canvasField.height = this.h;

    this.columns = Math.floor(this.w / this.size) + 1;
    this.rows = Math.floor(this.h / this.size) + 1;

    this.initField();
  }

  private initField(): void {
    this.field = new Array(this.columns);
    for (let x = 0; x < this.columns; x++) {
      this.field[x] = new Array(this.rows);
      for (let y = 0; y < this.rows; y++) {
        this.field[x][y] = [0, 0];
      }
    }
  }

  private calculateField(): void {
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        const angle = this.noise2D(x / 40, y / 40 + this.noiseZ * 0.3) * Math.PI * 1.5;
        const length = this.noise2D(x / 60 + 20000, y / 60 + this.noiseZ * 0.2) * 0.4 + 0.2;
        this.field[x][y][0] = angle;
        this.field[x][y][1] = Math.min(length, 0.6);
      }
    }
  }

  private drawField(): void {
    const canvasField = this.fieldCanvas.nativeElement;
    const ctx = canvasField.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgba(5, 15, 25, 0.1)';
    ctx.fillRect(0, 0, canvasField.width, canvasField.height);

    const gradientStops = [
      { position: 0, color: '#00ffd0' },
      { position: 0.3, color: '#00e0ff' },
      { position: 0.7, color: '#0088ff' },
      { position: 1, color: '#0044ff' }
    ];

    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        const angle = this.field[x][y][0];
        const length = this.field[x][y][1];
        const posX = x / this.columns;
        const posY = y / this.rows;
        const position = posX * 0.7 + posY * 0.3;

        let color = gradientStops[0].color;
        for (let i = 1; i < gradientStops.length; i++) {
          if (position <= gradientStops[i].position) {
            const p = (position - gradientStops[i - 1].position) /
                      (gradientStops[i].position - gradientStops[i - 1].position);
            color = interpolateColor(gradientStops[i - 1].color, gradientStops[i].color, p);
            break;
          }
        }

        ctx.save();
        ctx.translate(x * this.size, y * this.size);
        ctx.rotate(angle);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.size * length);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  private animate(): void {
    const now = performance.now();
    const delta = now - this.lastFrameTime;

    if (delta > this.frameInterval) {
      this.lastFrameTime = now - (delta % this.frameInterval);
      this.calculateField();
      this.noiseZ += 0.065;
      this.drawField();
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  private async initParticles(): Promise<void> {
    if (this.particlesInitialized) return;

    const container = this.el.nativeElement.querySelector('#tsparticles');
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    this.size = isMobile ? this.baseSize * 3 : this.baseSize;

    await loadSlim(tsParticles);

    await tsParticles.load({
      id: 'tsparticles',
      element: container,
      options: {
        fpsLimit: isMobile ? 30 : 60,
        particles: {
          number: {
            value: isMobile ? 30 : 60,
            density: {
              enable: true,
              value_area: isMobile ? 500 : 700
            }
          },
          color: {
            value: ['#00e0ff', '#00a8ff', '#0077ff']
          },
          shape: {
            type: 'circle'
          },
          opacity: {
            value: isMobile ? 0.2 : 0.4,
            random: true,
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.1
            }
          },
          size: {
            value: isMobile ? 0.8 : 1.2,
            random: {
              enable: true,
              minimumValue: 0.3
            }
          },
          move: {
            enable: true,
            speed: isMobile ? 0.2 : 0.4,
            direction: 'none',
            outMode: 'out',
            warp: true
          }
        },
        interactivity: {
          detect_on: 'window',
          events: {
            resize: true
          }
        },
        detectRetina: true
      }
    });

    this.particlesInitialized = true;
  }
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  const hex = (color: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  };

  const rgb1 = hex(color1);
  const rgb2 = hex(color2);

  const r = Math.round(rgb1[0] + factor * (rgb2[0] - rgb1[0]));
  const g = Math.round(rgb1[1] + factor * (rgb2[1] - rgb1[1]));
  const b = Math.round(rgb1[2] + factor * (rgb2[2] - rgb1[2]));

  return `rgb(${r}, ${g}, ${b})`;
}
