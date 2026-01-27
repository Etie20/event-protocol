import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BottomNavComponent } from '../../shared';
import { EventService, AuthService } from '../../core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BottomNavComponent, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
      
      <!-- User Header -->
      <header class="bg-white sticky top-0 z-30 safe-top border-b border-slate-100 shadow-sm">
        <div class="px-5 py-4 flex items-center justify-between">
           <div>
             <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Bonjour,</p>
             <h1 class="text-xl font-bold text-slate-900">{{ (authService.user()?.name || '').split(' ')[0] }}</h1>
           </div>
           
           @if (authService.user()?.photo; as photo) {
            <img [src]="photo" alt="Profile" class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm hover:scale-105 transition-transform cursor-pointer" routerLink="/settings"/>
           } @else {
             <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shadow-sm cursor-pointer hover:bg-indigo-200 transition-colors" routerLink="/settings">
               {{ authService.userInitials() }}
             </div>
           }
        </div>
      </header>

      <main class="max-w-md mx-auto p-5 space-y-6">

        <!-- Identity Section (Concept: Access Pass) -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-[10px] font-bold tracking-wide uppercase border border-green-100 mb-2">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              En Direct
            </span>
            <h2 class="text-lg font-bold text-slate-900 leading-tight">{{ event()?.name }}</h2>
            <p class="text-slate-500 text-sm mt-1">{{ formatDate(event()?.date) }}</p>
          </div>
          <div class="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
          </div>
        </div>

        <!-- Monitoring Section -->
        <div>
          <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Statistiques</h3>
          <div class="grid grid-cols-2 gap-3">
            
            <!-- Main Gauge Card -->
            <div class="col-span-1 bg-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200 flex flex-col justify-between relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl pointer-events-none"></div>
              
              <p class="text-indigo-200 text-xs font-medium uppercase relative z-10">Présents</p>
              <div class="relative z-10 my-2">
                <span class="text-4xl font-bold tracking-tight">{{ stats()?.scannedCount }}</span>
                <span class="text-sm text-indigo-300 font-medium ml-1">/ {{ stats()?.totalExpected }}</span>
              </div>
              
              <div class="w-full bg-black/20 h-1.5 rounded-full overflow-hidden relative z-10">
                <div class="h-full bg-green-400 rounded-full transition-all duration-500" [style.width.%]="stats()?.progressPercent"></div>
              </div>
            </div>

            <!-- Detail Stack -->
            <div class="col-span-1 flex flex-col gap-3">
              <div class="flex-1 bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase">Attendu</p>
                  <p class="text-xl font-bold text-slate-900">{{ (stats()?.totalExpected || 0) - (stats()?.scannedCount || 0) }}</p>
                </div>
                <div class="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>

              <div class="flex-1 bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-red-400 font-bold uppercase">Refusés</p>
                  <p class="text-xl font-bold text-red-600">{{ stats()?.refusedCount }}</p>
                </div>
                <div class="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Quick Actions Grid -->
        <div>
          <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Actions</h3>
          <div class="grid grid-cols-4 gap-3">
            
            <a routerLink="/scanner" class="col-span-2 bg-slate-900 text-white p-4 rounded-2xl shadow-lg shadow-slate-200 flex flex-col items-center justify-center gap-2 text-center active:scale-95 transition-transform relative overflow-hidden group">
               <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
               <svg class="w-8 h-8 mb-1" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"/><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 14.625v6m3-3h-6"/></svg>
               <span class="font-bold text-sm">Scanner</span>
            </a>

            <a routerLink="/guests" class="col-span-1 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-1 text-center active:scale-95 transition-transform hover:bg-slate-50 aspect-square">
               <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
               <span class="font-medium text-[10px] text-slate-600">Liste</span>
            </a>

            <a routerLink="/search" class="col-span-1 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-1 text-center active:scale-95 transition-transform hover:bg-slate-50 aspect-square">
               <svg class="w-6 h-6 text-slate-400 hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
               <span class="font-medium text-[10px] text-slate-600">Recherche</span>
            </a>

          </div>
        </div>

      </main>

      <app-bottom-nav />
    </div>
  `,

  styles: [`
    .safe-top {
      padding-top: env(safe-area-inset-top);
    }
  `]
})
export class DashboardComponent {
  readonly eventService = inject(EventService);
  readonly authService = inject(AuthService);

  readonly event = this.eventService.currentEvent;
  readonly stats = this.eventService.stats;

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}
