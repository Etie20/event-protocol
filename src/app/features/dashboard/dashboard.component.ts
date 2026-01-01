import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HeaderComponent, BottomNavComponent, PhaseTabsComponent } from '../../shared';
import { EventService, AuthService } from '../../core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, BottomNavComponent, PhaseTabsComponent, DatePipe],
  template: `
    <div class="min-h-screen bg-gray-50 pb-24">
      <!-- Header -->
      <header class="bg-primary text-white">
        <div class="flex items-center justify-between px-4 py-3">
          <button class="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
            </svg>
          </button>
          <span class="font-semibold">WePlanner Protocol</span>
          @if (authService.user()?.photo; as photo) {
            <img [src]="photo" alt="User" class="w-9 h-9 rounded-full border-2 border-white/30 object-cover"/>
          } @else {
            <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
              {{ authService.userInitials() }}
            </div>
          }
        </div>
      </header>
      
      <!-- Event Banner -->
      <div class="bg-primary text-white px-4 pb-4">
        <div class="flex justify-center mb-3">
          <span class="px-4 py-1.5 bg-white/15 backdrop-blur rounded-full text-xs font-semibold tracking-wide">
            ÉVÉNEMENT EN COURS
          </span>
        </div>
        <h2 class="text-2xl font-bold text-center">{{ event()?.name }}</h2>
        <p class="text-white/70 text-sm text-center mt-2 flex items-center justify-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
          </svg>
          24 Juin 2024
        </p>
      </div>
      
      <!-- Phase Tabs -->
      <div class="bg-primary">
        <app-phase-tabs 
          [phases]="event()?.phases ?? []"
          [activePhase]="eventService.activePhase()"
          (phaseChange)="eventService.setActivePhase($event)"
        />
      </div>

      <!-- Stats Card -->
      <div class="px-4 -mt-3 relative z-10">
        <div class="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
          <!-- Real-time indicator -->
          <div class="flex items-center justify-center gap-2 mb-4">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Temps Réel</span>
          </div>
          
          <p class="text-xs text-gray-400 text-center uppercase tracking-widest font-medium">Invités Scannés</p>
          <p class="text-7xl font-bold text-center text-gray-900 my-3 tabular-nums">{{ stats()?.scannedCount }}</p>
          
          <!-- Progress Bar -->
          <div class="mt-4">
            <div class="flex items-center justify-between text-sm mb-2">
              <span class="text-gray-500 font-medium">Progression</span>
              <span class="font-bold text-primary">{{ stats()?.progressPercent }}%</span>
            </div>
            <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-700 ease-out"
                [style.width.%]="stats()?.progressPercent"
              ></div>
            </div>
            <p class="text-center text-sm text-gray-400 mt-3">
              sur <span class="font-bold text-gray-600">{{ stats()?.totalExpected }}</span> attendus
            </p>
          </div>

          <!-- Mini Stats Grid -->
          <div class="grid grid-cols-2 gap-3 mt-6">
            <div class="bg-green-50 rounded-xl p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ stats()?.validatedCount }}</p>
                  <p class="text-xs text-gray-500 font-medium">Validés</p>
                </div>
              </div>
            </div>
            <div class="bg-red-50 rounded-xl p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ stats()?.refusedCount }}</p>
                  <p class="text-xs text-gray-500 font-medium">Refusés</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Section -->
        <div class="mt-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-900">Activité Récente</h3>
            <button class="text-primary text-sm font-semibold hover:text-primary-dark transition-colors">Voir tout</button>
          </div>
          
          <div class="space-y-3">
            @for (log of eventService.activityLogs().slice(0, 4); track log.id) {
              <div class="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
                <div [class]="getStatusIconClass(log.status)">
                  @if (log.status === 'validated') {
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                    </svg>
                  } @else {
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  }
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-900 truncate">{{ log.guestName }}</p>
                  <p class="text-xs text-gray-400">{{ log.table ? log.table + ' • ' : '' }}{{ log.category }}</p>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="text-sm text-gray-500 font-medium">{{ formatTime(log.time) }}</p>
                  <p [class]="getStatusTextClass(log.status)">
                    {{ log.status === 'validated' ? 'VALIDÉ' : 'ERREUR' }}
                  </p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Quick Access Card -->
        <div class="mt-6 mb-4">
          <button class="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
              </svg>
            </div>
            <div class="flex-1 text-left">
              <p class="font-semibold text-gray-900">Liste des invités</p>
              <p class="text-sm text-gray-400">Recherche manuelle</p>
            </div>
            <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
            </svg>
          </button>
        </div>
      </div>

      <app-bottom-nav />
    </div>
  `
})
export class DashboardComponent {
  readonly eventService = inject(EventService);
  readonly authService = inject(AuthService);

  readonly event = this.eventService.currentEvent;
  readonly stats = this.eventService.stats;

  getStatusIconClass(status: string): string {
    const base = 'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0';
    return status === 'validated' ? `${base} bg-green-500` : `${base} bg-red-500`;
  }

  getStatusTextClass(status: string): string {
    const base = 'text-xs font-bold';
    return status === 'validated' ? `${base} text-green-500` : `${base} text-red-500`;
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}
