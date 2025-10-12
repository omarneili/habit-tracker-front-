import { Component, AfterViewInit, ElementRef, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

interface MatrixChar {
  char: string;
  x: number;
  y: number;
  speed: number;
  opacity: number;
  brightness: number;
}

interface GridCell {
  x: number;
  y: number;
  active: boolean;
  intensity: number;
  pulse: number;
  isHabit: boolean;
  habitType: string;
}

@Component({
  selector: 'app-splash',
  standalone: true,
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('matrixCanvas') matrixCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('title') title!: ElementRef<HTMLHeadingElement>;
  @ViewChild('subtitle') subtitle!: ElementRef<HTMLParagraphElement>;

  private ctx!: CanvasRenderingContext2D;
  private matrixCtx!: CanvasRenderingContext2D;
  private animationFrameId!: number;
  private startTime!: number;
  private phase = 0;
  
  private matrixChars: MatrixChar[] = [];
  private gridCells: GridCell[] = [];
  private readonly gridSize = 7;
  private readonly matrixCharset = '0123456789✅❌⚡🔥💧🏃‍♂️🧘‍♂️📚🎯⭐🔒🔓❤️💤🍎🚰🏋️‍♂️';
  private columns: number = 0;
  private drops: number[] = [];

  private habitTypes = ['fitness', 'reading', 'sleep', 'water', 'meditation', 'work', 'learning'];
  private habitColors = {
    fitness: '#FF6B6B',
    reading: '#4ECDC4',
    sleep: '#45B7D1',
    water: '#96CEB4',
    meditation: '#FFEAA7',
    work: '#DDA0DD',
    learning: '#98D8C8'
  };

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.initializeCanvases();
    this.initializeMatrix();
    this.initializeHabitGrid();
    this.startAnimation();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.initializeCanvases();
    this.initializeMatrix();
  }

  private initializeCanvases(): void {
    const canvas = this.canvas.nativeElement;
    const matrixCanvas = this.matrixCanvas.nativeElement;
    const container = canvas.parentElement;
    
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      matrixCanvas.width = container.clientWidth;
      matrixCanvas.height = container.clientHeight;
    }

    this.ctx = canvas.getContext('2d')!;
    this.matrixCtx = matrixCanvas.getContext('2d')!;
    this.matrixCtx.font = '16px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
  }

  private initializeMatrix(): void {
    this.matrixChars = [];
    this.columns = Math.floor(this.matrixCanvas.nativeElement.width / 24);
    this.drops = Array(this.columns).fill(1);
    
    for (let i = 0; i < 150; i++) {
      this.matrixChars.push({
        char: this.matrixCharset[Math.floor(Math.random() * this.matrixCharset.length)],
        x: Math.random() * this.matrixCanvas.nativeElement.width,
        y: Math.random() * this.matrixCanvas.nativeElement.height,
        speed: 0.5 + Math.random() * 2,
        opacity: Math.random() * 0.6,
        brightness: Math.random() * 0.8 + 0.2
      });
    }
  }

  private initializeHabitGrid(): void {
    this.gridCells = [];
    const cellSize = this.canvas.nativeElement.width / this.gridSize;
    
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const isHabit = Math.random() > 0.6;
        const habitType = isHabit ? this.habitTypes[Math.floor(Math.random() * this.habitTypes.length)] : '';
        
        this.gridCells.push({
          x: col * cellSize,
          y: row * cellSize,
          active: false,
          intensity: 0,
          pulse: 0,
          isHabit: isHabit,
          habitType: habitType
        });
      }
    }
  }

  private startAnimation(): void {
    this.startTime = Date.now();
    this.animate();
  }

  private animate = (): void => {
    const currentTime = Date.now() - this.startTime;
    
    this.updateMatrix();
    
    switch (this.phase) {
      case 0: this.matrixRainPhase(currentTime); break;
      case 1: this.habitGridActivation(currentTime); break;
      case 2: this.titleRevealPhase(currentTime); break;
      case 3: this.habitsPulsePhase(currentTime); break;
      case 4: this.finalTransition(currentTime); break;
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  private updateMatrix(): void {
    this.matrixCtx.fillStyle = 'rgba(10, 15, 30, 0.08)';
    this.matrixCtx.fillRect(0, 0, this.matrixCanvas.nativeElement.width, this.matrixCanvas.nativeElement.height);

    this.matrixChars.forEach(char => {
      char.y += char.speed;
      
      if (char.y > this.matrixCanvas.nativeElement.height) {
        char.y = -30;
        char.x = Math.random() * this.matrixCanvas.nativeElement.width;
        char.char = this.matrixCharset[Math.floor(Math.random() * this.matrixCharset.length)];
        char.speed = 0.5 + Math.random() * 2;
        char.opacity = Math.random() * 0.6;
      }

      const brightness = this.phase >= 1 ? char.brightness * 0.4 : char.brightness;
      this.matrixCtx.fillStyle = `rgba(100, 200, 255, ${char.opacity * brightness})`;
      this.matrixCtx.fillText(char.char, char.x, char.y);
    });

    if (this.phase === 0) {
      for (let i = 0; i < this.drops.length; i++) {
        const text = this.matrixCharset[Math.floor(Math.random() * this.matrixCharset.length)];
        this.matrixCtx.fillStyle = '#64C8FF';
        this.matrixCtx.fillText(text, i * 24, this.drops[i] * 24);
        
        if (this.drops[i] * 24 > this.matrixCanvas.nativeElement.height && Math.random() > 0.975) {
          this.drops[i] = 0;
        }
        this.drops[i]++;
      }
    }
  }

  private matrixRainPhase(currentTime: number): void {
    this.canvas.nativeElement.style.opacity = '0';
    
    if (currentTime > 1800) {
      this.phase = 1;
      this.startTime = Date.now();
    }
  }

  private habitGridActivation(currentTime: number): void {
    const progress = Math.min(currentTime / 2000, 1);
    const easedProgress = this.easeOutCubic(progress);
    
    this.canvas.nativeElement.style.opacity = easedProgress.toString();
    this.drawGrid(easedProgress);

    const activationWave = Math.floor(easedProgress * this.gridCells.length * 1.3);
    
    this.gridCells.forEach((cell, index) => {
      if (index <= activationWave) {
        const delay = index * 0.03;
        const cellProgress = Math.max(0, (easedProgress - delay) / (1 - delay));
        
        if (cellProgress > 0) {
          cell.active = true;
          cell.intensity = cellProgress;
          cell.pulse = Math.sin(cellProgress * Math.PI) * 0.5 + 0.5;
        }
      }
      
      if (cell.active) {
        this.drawHabitCell(cell);
      }
    });

    if (progress >= 1) {
      this.phase = 2;
      this.startTime = Date.now();
    }
  }

  private titleRevealPhase(currentTime: number): void {
    this.drawGrid(1);
    this.gridCells.forEach(cell => this.drawHabitCell(cell));

    const progress = Math.min(currentTime / 1200, 1);
    const easedProgress = this.easeOutBack(progress);

    this.title.nativeElement.style.opacity = easedProgress.toString();
    this.title.nativeElement.style.transform = `
      translateY(${40 * (1 - easedProgress)}px) 
      scale(${0.8 + easedProgress * 0.2})
    `;
    this.title.nativeElement.style.filter = `blur(${8 * (1 - easedProgress)}px)`;

    const subtitleProgress = Math.max(0, (progress - 0.2) / 0.8);
    const easedSubtitleProgress = this.easeOutCubic(subtitleProgress);
    
    this.subtitle.nativeElement.style.opacity = easedSubtitleProgress.toString();
    this.subtitle.nativeElement.style.transform = `translateY(${25 * (1 - easedSubtitleProgress)}px)`;
    this.subtitle.nativeElement.style.filter = `blur(${4 * (1 - easedSubtitleProgress)}px)`;

    if (progress >= 1) {
      this.phase = 3;
      this.startTime = Date.now();
    }
  }

  private habitsPulsePhase(currentTime: number): void {
    this.drawGrid(1);
    
    const pulseValue = Math.sin(currentTime * 0.004) * 0.4 + 0.6;
    
    this.gridCells.forEach(cell => {
      if (cell.isHabit) {
        cell.pulse = pulseValue + Math.random() * 0.15;
      }
      this.drawHabitCell(cell);
    });


    const glowIntensity = Math.sin(currentTime * 0.003) * 0.3 + 0.7;
    this.title.nativeElement.style.filter = `brightness(${0.8 + glowIntensity * 0.4})`;
    

    this.title.nativeElement.style.textShadow = `
      0 0 ${10 + glowIntensity * 10}px rgba(255, 255, 255, ${0.2 + glowIntensity * 0.2}),
      0 0 ${20 + glowIntensity * 15}px rgba(255, 255, 255, ${0.1 + glowIntensity * 0.1}),
      0 0 ${30 + glowIntensity * 20}px rgba(255, 255, 255, ${0.05 + glowIntensity * 0.05})
    `;

    if (currentTime > 2500) {
      this.phase = 4;
      this.startTime = Date.now();
    }
  }

  private finalTransition(currentTime: number): void {
    const progress = Math.min(currentTime / 1200, 1);
    const easedProgress = this.easeInCubic(progress);

    const opacity = 1 - easedProgress;
    this.canvas.nativeElement.style.opacity = opacity.toString();
    this.matrixCanvas.nativeElement.style.opacity = opacity.toString();
    this.title.nativeElement.style.opacity = opacity.toString();
    this.subtitle.nativeElement.style.opacity = opacity.toString();

    const scale = 1 + easedProgress * 0.3;
    const blur = easedProgress * 15;
    
    this.title.nativeElement.style.transform = `scale(${scale})`;
    this.title.nativeElement.style.filter = `blur(${blur}px)`;

    if (progress >= 1) {
      cancelAnimationFrame(this.animationFrameId);
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 400);
    }
  }

  private drawGrid(opacity: number): void {
    const cellSize = this.canvas.nativeElement.width / this.gridSize;
    
    this.ctx.strokeStyle = `rgba(100, 200, 255, ${0.2 * opacity})`;
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([3, 3]);

    for (let i = 0; i <= this.gridSize; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * cellSize, 0);
      this.ctx.lineTo(i * cellSize, this.canvas.nativeElement.height);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(0, i * cellSize);
      this.ctx.lineTo(this.canvas.nativeElement.width, i * cellSize);
      this.ctx.stroke();
    }

    this.ctx.setLineDash([]);
  }

  private drawHabitCell(cell: GridCell): void {
    const cellSize = this.canvas.nativeElement.width / this.gridSize;
    const size = cellSize * 0.7 * cell.intensity;
    const x = cell.x + (cellSize - size) / 2;
    const y = cell.y + (cellSize - size) / 2;

    if (cell.isHabit) {

      const color = this.habitColors[cell.habitType as keyof typeof this.habitColors] || '#64C8FF';
      
      this.ctx.shadowColor = color + '80';
      this.ctx.shadowBlur = 15 * cell.pulse;
      
      this.ctx.fillStyle = color + '40';
      this.ctx.strokeStyle = color + 'CC';
      this.ctx.lineWidth = 2;
      
      this.ctx.beginPath();
      this.ctx.roundRect(x, y, size, size, 8);
      this.ctx.fill();
      this.ctx.stroke();
      if (cell.intensity > 0.5) {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size * 0.4}px "Segoe UI Emoji"`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const icon = this.getHabitIcon(cell.habitType);
        this.ctx.fillText(icon, cell.x + cellSize / 2, cell.y + cellSize / 2);
      }
    } else {

      this.ctx.shadowColor = 'rgba(100, 200, 255, 0.3)';
      this.ctx.shadowBlur = 5 * cell.pulse;
      
      this.ctx.fillStyle = `rgba(100, 200, 255, ${0.1 * cell.pulse})`;
      this.ctx.strokeStyle = `rgba(100, 200, 255, ${0.3 * cell.pulse})`;
      this.ctx.lineWidth = 1;
      
      this.ctx.beginPath();
      this.ctx.roundRect(x, y, size, size, 4);
      this.ctx.fill();
      this.ctx.stroke();
    }

    this.ctx.shadowBlur = 0;
  }

  private getHabitIcon(habitType: string): string {
    const icons: { [key: string]: string } = {
      fitness: '🏃‍♂️',
      reading: '📚',
      sleep: '💤',
      water: '🚰',
      meditation: '🧘‍♂️',
      work: '💼',
      learning: '🎯'
    };
    return icons[habitType] || '⭐';
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  private easeInCubic(t: number): number {
    return t * t * t;
  }

  private easeOutBack(t: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
  

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}