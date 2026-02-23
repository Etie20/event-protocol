import { Component, inject } from '@angular/core';
import { BottomNavComponent } from '../../shared';
import { AuthService, EventService } from '../../core';

@Component({
  selector: 'app-guest',
  imports: [
    BottomNavComponent
  ],
  templateUrl: './guest.html',
  styleUrl: './guest.css',
})
export class Guest {
  readonly eventService = inject(EventService);
  readonly stats = this.eventService.stats;
  readonly currentEvent = this.eventService.currentEvent;
  // readonly activePhase = this.eventService.activePhase; // Removed in new model

  getStatusIconClass(status: string): string {
    const base = 'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0';
    return status === 'validated' ? `${base} bg-green-100 text-green-600` : `${base} bg-red-100 text-red-600`;
  }

  getStatusTextClass(status: string): string {
    const base = 'text-xs font-bold';
    return status === 'validated' ? `${base} text-green-600` : `${base} text-red-600`;
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'vip': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'famille_marie':
      case 'famille_mariee': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ami': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'collegue': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'vip': 'VIP',
      'famille_marie': 'Famille Marié',
      'famille_mariee': 'Famille Mariée',
      'ami': 'Ami(e)',
      'collegue': 'Collègue',
      'standard': 'Invité',
    };
    return labels[category] || category;
  }

  getPhaseLabel(phaseId: string | null): string {
    if (!phaseId) return '';
    // const phase = this.currentEvent()?.phases?.find(p => p.id === phaseId);
    // return phase ? phase.name : phaseId;
    return 'Phase'; // Placeholder until phases are back
  }

  getProgressBackground(): string {
    const percent = this.stats()?.progressPercent || 0;
    return `conic-gradient(#4f46e5 ${percent}%, transparent 0)`;
  }
}

