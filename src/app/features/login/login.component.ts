import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Purple Header -->
      <div class="bg-primary text-white text-center py-12 px-6 rounded-b-[2rem]">
        <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold">WePlanner Protocol</h1>
        <p class="text-white/70 text-sm mt-1">SÉCURITÉ & LOGISTIQUE</p>
      </div>

      <!-- Login Card -->
      <div class="flex-1 px-6 -mt-6">
        <div class="card p-6">
          <h2 class="text-2xl font-bold text-center text-gray-900 mb-2">Connexion</h2>
          <p class="text-gray-500 text-center text-sm mb-6">
            Veuillez vous identifier pour accéder au protocole.
          </p>

          <!-- QR Scanner Button -->
          <button 
            (click)="scanQR()"
            class="btn btn-secondary w-full mb-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
            </svg>
            SCANNER LE QR CODE
          </button>
          <p class="text-xs text-gray-400 text-center mb-6">Recommandé pour le personnel sur site</p>

          <!-- Divider -->
          <div class="flex items-center gap-4 my-6">
            <div class="flex-1 h-px bg-gray-200"></div>
            <span class="text-gray-400 text-sm">OU</span>
            <div class="flex-1 h-px bg-gray-200"></div>
          </div>

          <!-- Manual Code Entry -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Code d'accès Événement</label>
              <div class="relative">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
                <input 
                  type="text" 
                  [(ngModel)]="accessCode"
                  placeholder="Ex: 123456"
                  maxlength="6"
                  class="input pl-12"
                />
              </div>
            </div>

            <button 
              (click)="loginWithCode()"
              [disabled]="accessCode().length !== 6 || isLoading()"
              class="btn btn-primary w-full"
            >
              @if (isLoading()) {
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              } @else {
                Accéder à l'événement
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              }
            </button>
          </div>
        </div>

        <!-- Help Link -->
        <div class="text-center mt-6">
          <button class="text-gray-400 text-sm inline-flex items-center gap-1 hover:text-primary transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Problème de connexion ?
          </button>
        </div>

        <!-- Version -->
        <p class="text-center text-gray-300 text-xs mt-4">WePlanner App v2.4.0</p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  accessCode = signal('');
  isLoading = signal(false);

  async loginWithCode(): Promise<void> {
    this.isLoading.set(true);
    const success = await this.authService.loginWithCode(this.accessCode());
    this.isLoading.set(false);
    
    if (success) {
      this.router.navigate(['/dashboard']);
    }
  }

  async scanQR(): Promise<void> {
    // In a real app, this would open the camera
    this.isLoading.set(true);
    const success = await this.authService.loginWithQR('mock-qr-data');
    this.isLoading.set(false);
    
    if (success) {
      this.router.navigate(['/dashboard']);
    }
  }
}
