import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-scan-success',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-gray-200 min-h-screen flex items-center justify-center p-4 font-display">
      <div class="relative w-full max-w-[420px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[850px] max-h-[90vh] ring-8 ring-gray-900/5">
        <!-- App Header (Deep Purple) -->
        <header class="bg-brand-purple px-6 pt-8 pb-6 flex items-center justify-between shadow-md shrink-0 z-10">
          <div class="flex items-center gap-3 text-white">
            <span class="material-symbols-outlined text-white/80">security</span>
            <h1 class="text-sm font-bold tracking-wider uppercase opacity-90">WePlanner Protocol</h1>
          </div>
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <span class="material-symbols-outlined text-white text-sm">notifications</span>
            </div>
          </div>
        </header>

        <!-- Main Scrollable Content -->
        <main class="flex-1 overflow-y-auto no-scrollbar bg-white relative flex flex-col">
          <!-- Success Status Section -->
          <div class="flex flex-col items-center pt-10 pb-6 px-6 animate-scale-in">
            <div class="relative mb-4">
              <div class="absolute inset-0 bg-success/20 rounded-full blur-xl transform scale-75"></div>
              <span class="relative material-symbols-outlined text-success text-[100px] leading-none" style="font-variation-settings: 'FILL' 1, 'wght' 600;">
                check_circle
              </span>
            </div>
            <h2 class="text-success text-[32px] font-black leading-tight text-center tracking-tight uppercase">
              Accès Autorisé
            </h2>
            <p class="text-gray-400 font-medium text-sm mt-1">Scan ID {{ scanId || '#8839-22' }}</p>
          </div>

          @if (guest) {
            <!-- Guest Profile Card -->
            <div class="px-6 pb-6 flex flex-col items-center gap-4 animate-fade-in-up" style="animation-delay: 0.1s;">
              <div class="relative group">
                <div class="size-32 rounded-full p-1 bg-gradient-to-tr from-brand-purple to-purple-400">
                  <div class="w-full h-full rounded-full border-4 border-white bg-cover bg-center bg-gray-100" 
                       [style.background-image]="'url(' + (guest.photo || 'https://i.pravatar.cc/150') + ')'">
                  </div>
                </div>
                <div class="absolute bottom-1 right-1 bg-success border-[3px] border-white rounded-full p-1 size-8 flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-sm font-bold">check</span>
                </div>
              </div>
              
              <div class="flex flex-col items-center gap-2">
                <h3 class="text-gray-900 text-3xl font-bold text-center leading-tight">{{ guest.name }}</h3>
                @if (guest.category) {
                  <div class="flex items-center gap-2 bg-brand-purple/10 px-4 py-1.5 rounded-full border border-brand-purple/10">
                    <span class="material-symbols-outlined text-brand-purple text-lg">diversity_1</span>
                    <span class="text-brand-purple text-sm font-bold tracking-wide uppercase">{{ guest.category }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Placement Info -->
            @if (guest.table) {
              <div class="px-6 pb-8 flex-1 flex flex-col justify-center animate-fade-in-up" style="animation-delay: 0.2s;">
                <div class="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div class="absolute top-0 right-0 p-3 opacity-10">
                    <span class="material-symbols-outlined text-6xl">table_restaurant</span>
                  </div>
                  <p class="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Placement Assigné</p>
                  <div class="flex flex-col items-center gap-1">
                    <span class="text-gray-900 text-5xl font-black tracking-tighter">{{ guest.table }}</span>
                    <!-- Optional seat info could go here if available -->
                  </div>
                </div>
                <p class="text-center text-gray-400 text-sm mt-4 px-4 leading-relaxed">
                  Veuillez accompagner l'invité vers la zone de réception principale.
                </p>
              </div>
            }
          }
        </main>

        <!-- Footer Actions -->
        <footer class="bg-white px-6 py-6 border-t border-gray-100 shrink-0 flex flex-col gap-3">
          <button (click)="onFinish()" class="w-full bg-brand-orange hover:bg-orange-600 active:bg-orange-700 text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2 group">
            <span>Terminer</span>
            <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
          <button (click)="onHistory()" class="w-full bg-transparent hover:bg-gray-50 text-gray-400 h-12 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-lg">history</span>
            <span>Voir l'historique récent</span>
          </button>
        </footer>

        <!-- Bottom Safe Area -->
        <div class="h-5 bg-white w-full flex justify-center pb-2 rounded-b-3xl">
          <div class="w-32 h-1.5 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class ScanSuccessComponent {
    @Input() guest: any;
    @Input() scanId?: string;

    @Output() finish = new EventEmitter<void>();
    @Output() history = new EventEmitter<void>();

    onFinish() {
        this.finish.emit();
    }

    onHistory() {
        this.history.emit();
    }
}
