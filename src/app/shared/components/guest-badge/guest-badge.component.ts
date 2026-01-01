import { Component, input } from '@angular/core';
import { GuestCategory } from '../../../models';

@Component({
  selector: 'app-guest-badge',
  standalone: true,
  template: `
    <span [class]="badgeClass">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        @switch (category()) {
          @case ('vip') {
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          }
          @case ('famille_marie') {
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          }
          @default {
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          }
        }
      </svg>
      {{ label }}
    </span>
  `
})
export class GuestBadgeComponent {
  category = input<GuestCategory>('standard');

  get label(): string {
    const labels: Record<GuestCategory, string> = {
      vip: 'VIP',
      famille_marie: 'Famille du Marié',
      famille_mariee: 'Famille de la Mariée',
      ami: 'Ami',
      collegue: 'Collègue',
      standard: 'Invité'
    };
    return labels[this.category()];
  }

  get badgeClass(): string {
    const base = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium';
    const colors: Record<GuestCategory, string> = {
      vip: 'bg-amber-100 text-amber-800',
      famille_marie: 'bg-purple-100 text-purple-800',
      famille_mariee: 'bg-pink-100 text-pink-800',
      ami: 'bg-blue-100 text-blue-800',
      collegue: 'bg-green-100 text-green-800',
      standard: 'bg-gray-100 text-gray-800'
    };
    return `${base} ${colors[this.category()]}`;
  }
}
