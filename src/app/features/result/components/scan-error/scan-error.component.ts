import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-scan-error',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-[#e5e7eb] min-h-screen flex items-center justify-center font-display p-4 md:p-8">
      <div class="relative w-full max-w-[400px] h-[850px] bg-background-light dark:bg-background-dark rounded-[2.5rem] shadow-2xl overflow-hidden border-[8px] border-white dark:border-[#1a1a1a] flex flex-col">
        <!-- App Header (Deep Purple) -->
        <header class="bg-brand-purple-dark text-white px-6 py-4 flex items-center justify-between shadow-md z-10 shrink-0">
          <div class="flex items-center gap-3">
            <button (click)="onScanAnother()" class="flex items-center justify-center p-1 rounded-full hover:bg-white/10 transition-colors">
              <span class="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 class="text-lg font-bold tracking-tight">WePlanner Protocol</h1>
          </div>
          <button class="flex items-center justify-center p-1 rounded-full hover:bg-white/10 transition-colors">
            <span class="material-symbols-outlined text[24px]">more_vert</span>
          </button>
        </header>

        <!-- Main Scrollable Content -->
        <main class="flex-1 overflow-y-auto no-scrollbar bg-background-light dark:bg-background-dark flex flex-col">
          <!-- Error Visualization Section -->
          <div class="flex flex-col items-center justify-center pt-10 pb-6 px-6 text-center animate-fade-in">
            <div class="relative mb-6">
              <div class="absolute inset-0 bg-danger/10 rounded-full scale-150 animate-pulse"></div>
              <div class="relative bg-white dark:bg-[#331111] rounded-full p-6 shadow-sm border-4 border-danger">
                <span class="material-symbols-outlined text-danger text-[64px] font-bold">block</span>
              </div>
            </div>
            
            <h2 class="text-danger text-[32px] font-extrabold leading-tight tracking-tight uppercase mb-2">
              ACCÈS REFUSÉ
            </h2>
            
            <p class="text-[#181111] dark:text-gray-100 text-xl font-bold leading-normal">
              {{ errorMessage || 'ATTENTION : Billet DÉJÀ SCANNÉ !' }}
            </p>
            
            <p class="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
              Code erreur: {{ errorCode || '#E-302' }}
            </p>
          </div>

          <!-- Context Card: Who owns the ticket? -->
          @if (guest) {
            <div class="px-6 pb-6 w-full">
              <div class="bg-white dark:bg-[#2a1515] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-danger/20 relative overflow-hidden group">
                <div class="absolute top-0 left-0 w-1.5 h-full bg-danger"></div>
                <div class="flex items-start gap-4">
                  <!-- User Avatar -->
                  <div class="relative size-16 shrink-0 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700 bg-gray-200">
                    <div class="w-full h-full bg-center bg-no-repeat bg-cover" 
                         [style.background-image]="'url(' + (guest.photo || 'https://i.pravatar.cc/150') + ')'">
                    </div>
                  </div>
                  
                  <!-- Ticket Info -->
                  <div class="flex flex-col flex-1 min-w-0">
                    <h3 class="text-[#181111] dark:text-white text-lg font-bold truncate">{{ guest.name }}</h3>
                    <p class="text-[#896161] dark:text-gray-300 text-sm font-medium mb-2">
                      {{ guest.category || 'Visiteur' }} - Billet #{{ guest.ticketId || 'Unknown' }}
                    </p>
                    
                    <!-- Previous Scan Details -->
                    @if (previousScan) {
                      <div class="flex items-center gap-2 bg-danger/5 dark:bg-danger/20 p-2 rounded-lg">
                        <span class="material-symbols-outlined text-danger text-[18px]">history</span>
                        <span class="text-danger text-xs font-bold uppercase tracking-wide">
                          Validé à {{ previousScan | date:'HH:mm' }}
                        </span>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Additional Warning/Instruction -->
          <div class="px-6 pb-4 w-full">
            <div class="bg-orange-50 dark:bg-[#331800] border border-orange-100 dark:border-orange-900/30 rounded-lg p-4 flex gap-3 items-start">
              <span class="material-symbols-outlined text-orange-600 dark:text-orange-400 mt-0.5 shrink-0">info</span>
              <div>
                <p class="text-sm text-gray-800 dark:text-gray-200 font-medium">
                  Veuillez vérifier l'identité du visiteur ou contacter le superviseur de zone.
                </p>
              </div>
            </div>
          </div>
        </main>

        <!-- Fixed Bottom Action Bar -->
        <footer class="bg-white dark:bg-[#1a0a0a] p-6 border-t border-gray-100 dark:border-gray-800 shrink-0">
          <button (click)="onScanAnother()" class="w-full h-14 bg-brand-orange-red hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]">
            <span class="material-symbols-outlined text-[24px]">qr_code_scanner</span>
            <span class="text-base font-bold uppercase tracking-wider">Scanner un autre billet</span>
          </button>
          <button (click)="onReportProblem()" class="w-full mt-3 h-10 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
            <span class="material-symbols-outlined text-[18px]">flag</span>
            Signaler un problème
          </button>
        </footer>
      </div>
    </div>
  `,
    styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class ScanErrorComponent {
    @Input() guest: any;
    @Input() errorCode?: string;
    @Input() errorMessage?: string;
    @Input() previousScan?: Date;

    @Output() scanAnother = new EventEmitter<void>();
    @Output() reportProblem = new EventEmitter<void>();

    onScanAnother() {
        this.scanAnother.emit();
    }

    onReportProblem() {
        this.reportProblem.emit();
    }
}
