import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apropos',
  templateUrl: './apropos.component.html',
  styleUrls: ['./apropos.component.css'],
  imports: [CommonModule]
})
export class AproposComponent implements OnInit, AfterViewInit, OnDestroy {
  gruyeres: number[] = [];
  private animationFrameId: number | null = null;

  constructor() {}

  ngOnInit(): void {
    this.gruyeres = Array(50).fill(0).map((_, index) => index);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.startAnimation();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private startAnimation(): void {
    const gruyereElements = this.gruyeres.map((_, index) => document.getElementById(`gruyere-${index}`) as HTMLImageElement);
  
    console.log('Gruyères trouvés :', gruyereElements);

   
    const gruyereStates = gruyereElements.map((element) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const gruyereSize = 50; 

      
      const initialX = Math.random() * (viewportWidth - gruyereSize);
      const initialY = Math.random() * (viewportHeight - gruyereSize);

      
      element.style.left = `${initialX}px`;
      element.style.top = `${initialY}px`;

      return {
        element,
        x: initialX,
        y: initialY,
        vx: (Math.random() * 5 - 1) * 5,
        vy: (Math.random() * 5 - 1) * 5
      };
    });

    const animate = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const gruyereSize = 50;

      gruyereStates.forEach((state) => {
        
        state.x += state.vx;
        state.y += state.vy;

      
        if (state.x <= 0 || state.x >= viewportWidth - gruyereSize) {
          state.vx = -state.vx;
          state.x = Math.max(0, Math.min(state.x, viewportWidth - gruyereSize));
        }
        if (state.y <= 0 || state.y >= viewportHeight - gruyereSize) {
          state.vy = -state.vy;
          state.y = Math.max(0, Math.min(state.y, viewportHeight - gruyereSize)); 
        }

       
        state.element.style.left = `${state.x}px`;
        state.element.style.top = `${state.y}px`;
      });

      
      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }
}