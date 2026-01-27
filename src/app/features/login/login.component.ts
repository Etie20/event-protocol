import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 relative overflow-hidden font-sans">
      
      <!-- Subtle Background Accents -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

      <!-- Main Container -->
      <div class="w-full max-w-sm relative z-10">
        
        <!-- Header / Logo -->
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-md mb-4 text-indigo-600">
             <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-800 tracking-tight">WePlanner Protocol</h1>
          <p class="text-slate-500 mt-2 text-sm font-medium">Connectez-vous pour accéder à l'événement</p>
        </div>

        <!-- Login Form Card -->
        <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/60 border border-white">
          
          <div class="space-y-6">
            
            <!-- QR Action -->
             <button 
              (click)="scanQR()"
              class="w-full py-4 px-4 bg-indigo-50 text-indigo-700 font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-indigo-100 active:scale-[0.98] transition-all border border-indigo-100"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.5 15h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm-2.25 0h.008v.008h-.008v-.008zm2.25 2.25h.008v.008h-.008v-.008zm-2.25 0h.008v.008h-.008v-.008zm2.25-4.5h.008v.008h-.008v-.008zm-2.25 0h.008v.008h-.008v-.008z"/>
              </svg>
              Scanner mon badge
            </button>

            <!-- Divider -->
            <div class="relative flex items-center py-2">
              <div class="flex-grow border-t border-slate-200"></div>
              <span class="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold uppercase tracking-widest">Ou par code</span>
              <div class="flex-grow border-t border-slate-200"></div>
            </div>

            <!-- Manual Entry -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700 ml-1">Code d'accès</label>
              <div class="relative">
                <input 
                  type="text" 
                  [(ngModel)]="accessCode"
                  placeholder="------"
                  maxlength="6"
                  class="w-full pl-4 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-center tracking-[0.5em] font-mono text-xl font-bold shadow-inner"
                />
              </div>
            </div>

            <!-- Submit -->
            <button 
              (click)="loginWithCode()"
              [disabled]="accessCode().length !== 6 || isLoading()"
              class="w-full py-4 px-6 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
            >
              @if (isLoading()) {
                <svg class="animate-spin w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              } @else {
                Accéder maintenant
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              }
            </button>

          </div>
        </div>

        <div class="mt-8 text-center text-xs text-slate-400 font-medium">
          <p>Besoin d'aide ? <a href="#" class="text-indigo-600 hover:underline">Contacter le support</a></p>
        </div>

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
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = await this.authService.loginWithCode(this.accessCode());
    this.isLoading.set(false);

    if (success) {
      this.router.navigate(['/dashboard']);
    }
  }

  async scanQR(): Promise<void> {
    this.isLoading.set(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = await this.authService.loginWithQR('mock-qr-data');
    this.isLoading.set(false);

    if (success) {
      this.router.navigate(['/dashboard']);
    }
  }
}
