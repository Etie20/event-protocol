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
          
          <form (ngSubmit)="login()" class="space-y-6">
            
            <!-- Email -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700 ml-1">Email</label>
              <input 
                type="email" 
                [(ngModel)]="email"
                name="email"
                placeholder="exemple@email.com"
                required
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium shadow-inner"
              />
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700 ml-1">Mot de passe</label>
              <input 
                type="password" 
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                required
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium shadow-inner"
              />
            </div>

            @if (errorMessage()) {
              <div class="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-start gap-2">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {{ errorMessage() }}
              </div>
            }

            <!-- Submit -->
            <button 
              type="submit"
              [disabled]="isLoading() || !email() || !password()"
              class="w-full py-4 px-6 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
            >
              @if (isLoading()) {
                <svg class="animate-spin w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              } @else {
                Se connecter
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              }
            </button>

          </form>
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

  email = signal('');
  password = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  async login(): Promise<void> {
    if (!this.email() || !this.password()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const success = await this.authService.login({
        email: this.email(),
        password: this.password()
      });

      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage.set('Email ou mot de passe incorrect');
      }
    } catch (e) {
      this.errorMessage.set('Une erreur est survenue');
    } finally {
      this.isLoading.set(false);
    }
  }
}
