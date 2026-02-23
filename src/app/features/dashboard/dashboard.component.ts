import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from '../../shared';
import { EventService, AuthService } from '../../core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BottomNavComponent, RouterLink, CommonModule],
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

        <h2 class="text-lg font-bold text-slate-800">Mes Événements</h2>

        @if (eventService.isLoading()) {
          <div class="flex justify-center py-12">
            <svg class="animate-spin w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        } @else if (eventService.events().length === 0) {
          <div class="text-center py-12">
            <p class="text-slate-500">Aucun événement trouvé.</p>
          </div>
        } @else {
          <div class="space-y-4">
            @for (event of eventService.events(); track event.id) {
              <div 
                [routerLink]="['/event', event.id]"
                class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm active:scale-[0.98] transition-all cursor-pointer hover:shadow-md flex gap-4"
              >
                <!-- Cover Image Stub -->
                <div class="w-20 h-20 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden">
                   @if(event.coverImageUrl) {
                     <img [src]="event.coverImageUrl" class="w-full h-full object-cover" />
                   } @else {
                     <div class="w-full h-full flex items-center justify-center text-slate-300">
                       <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                     </div>
                   }
                </div>

                <div class="flex-1 flex flex-col justify-center">
                  <h3 class="font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{{ event.title }}</h3>
                  <div class="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ event.startDate | date:'mediumDate' }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-slate-500">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="line-clamp-1">{{ event.locationName || 'En ligne' }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        }

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
export class DashboardComponent implements OnInit {
  readonly eventService = inject(EventService);
  readonly authService = inject(AuthService);

  ngOnInit() {
    this.eventService.loadEvents();
  }
}
