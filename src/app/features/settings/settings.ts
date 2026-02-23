import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [BottomNavComponent],
  template: `
    <div class="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 sticky top-0 z-30 safe-top">
        <div class="px-6 py-4">
          <h1 class="text-2xl font-bold text-gray-900">Paramètres</h1>
        </div>
      </header>

      <main class="p-4 space-y-6">
        
        <!-- Account Section -->
        <section>
          <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-2">Compte</h2>
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
             @if (authService.user()?.photo; as photo) {
               <img [src]="photo" alt="User" class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"/>
             } @else {
              <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                 {{ authService.userInitials() }}
              </div>
             }
             <div>
               <p class="font-bold text-lg">{{ authService.user()?.name }}</p>
               <p class="text-sm text-gray-500">{{ authService.user()?.role }}</p>
             </div>
          </div>
        </section>

        <!-- Scanner Settings -->
        <section>
          <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-2">Scanner</h2>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            
            <label class="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                </div>
                <span class="font-medium">Son de validation</span>
              </div>
              <div class="relative inline-block w-12 h-6 rounded-full transition-colors duration-200"
                   [class.bg-green-500]="soundEnabled()" [class.bg-gray-200]="!soundEnabled()">
                   <input type="checkbox" class="hidden" [checked]="soundEnabled()" (change)="soundEnabled.set(!soundEnabled())">
                   <div class="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm"
                        [class.translate-x-6]="soundEnabled()"></div>
              </div>
            </label>

            <label class="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <span class="font-medium">Vibration</span>
              </div>
              <div class="relative inline-block w-12 h-6 rounded-full transition-colors duration-200"
                   [class.bg-green-500]="vibrateEnabled()" [class.bg-gray-200]="!vibrateEnabled()">
                   <input type="checkbox" class="hidden" [checked]="vibrateEnabled()" (change)="vibrateEnabled.set(!vibrateEnabled())">
                   <div class="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm"
                        [class.translate-x-6]="vibrateEnabled()"></div>
              </div>
            </label>

          </div>
        </section>

        <!-- General Actions -->
        <section>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left transition-colors">
              <span class="font-medium">Aide & Support</span>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left transition-colors">
              <span class="font-medium">Confidentialité</span>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </section>

        <button (click)="logout()" class="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
           Déconnexion
        </button>

        <p class="text-center text-xs text-gray-400 pt-4">WePlanner Protocol v2.4.0 (Build 2024.06.24)</p>

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
export class SettingsComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  soundEnabled = signal(true);
  vibrateEnabled = signal(true);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
