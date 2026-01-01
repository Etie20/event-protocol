import { Component, input, output } from '@angular/core';
import { EventPhase } from '../../../models';

@Component({
  selector: 'app-phase-tabs',
  standalone: true,
  template: `
    <div class="flex justify-center gap-1 px-4 py-3 bg-white/5 backdrop-blur-sm">
      @for (phase of phases(); track phase.id) {
        <button 
          (click)="phaseChange.emit(phase.id)"
          [class]="getTabClass(phase.id)"
        >
          {{ phase.name }}
        </button>
      }
    </div>
  `
})
export class PhaseTabsComponent {
  phases = input<EventPhase[]>([]);
  activePhase = input<string>('');
  phaseChange = output<string>();

  getTabClass(phaseId: string): string {
    const base = 'px-5 py-2 rounded-full text-sm font-medium transition-all duration-200';
    if (phaseId === this.activePhase()) {
      return `${base} bg-white text-primary shadow-sm`;
    }
    return `${base} text-white/70 hover:text-white hover:bg-white/10`;
  }
}
