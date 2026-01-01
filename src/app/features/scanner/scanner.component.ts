import { Component, inject, signal, OnDestroy, AfterViewInit, ElementRef, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ScannerService } from '../../core';
import { Html5Qrcode } from 'html5-qrcode';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-black relative overflow-hidden">
      <!-- Camera View -->
      <div id="qr-reader" #qrReader class="absolute inset-0 w-full h-full"></div>
      
      <!-- Overlay -->
      <div class="absolute inset-0 pointer-events-none">
        <!-- Top gradient -->
        <div class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent"></div>
        <!-- Bottom gradient -->
        <div class="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/90 to-transparent"></div>
      </div>

      <!-- Header -->
      <div class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 pt-6">
        <button (click)="goBack()" class="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <span class="px-4 py-2 bg-primary rounded-full text-white text-sm font-semibold shadow-lg">
          WEPLANNER PROTOCOL
        </span>
        <button class="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>
      </div>

      <!-- Scanner Frame & Instructions -->
      <div class="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <p class="text-white text-lg font-medium mb-6 drop-shadow-lg">Visez le QR code du billet</p>
        
        <!-- Scanner Frame -->
        <div class="relative w-64 h-64">
          <!-- Animated corners -->
          <div class="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-secondary rounded-tl-2xl"></div>
          <div class="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-secondary rounded-tr-2xl"></div>
          <div class="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-secondary rounded-bl-2xl"></div>
          <div class="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-secondary rounded-br-2xl"></div>
          
          <!-- Scanning line -->
          <div class="absolute inset-x-4 top-4 bottom-4 overflow-hidden">
            <div class="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-scan"></div>
          </div>
        </div>

        <p class="text-white/60 text-sm mt-6">Le scan se lancera automatiquement</p>
        
        @if (cameraError()) {
          <div class="mt-4 px-4 py-2 bg-red-500/80 backdrop-blur rounded-lg">
            <p class="text-white text-sm">{{ cameraError() }}</p>
          </div>
        }
      </div>

      <!-- Bottom Actions -->
      <div class="absolute bottom-0 left-0 right-0 z-20 p-6 pb-10">
        <!-- Manual Entry Button -->
        <button 
          (click)="showManualEntry.set(true)"
          class="w-full bg-gray-800/80 backdrop-blur-md text-white py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-700/80 transition-all pointer-events-auto"
        >
          <svg class="w-5 h-5 text-primary-light" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
          </svg>
          <span class="font-medium">Saisie manuelle</span>
        </button>

        <!-- Close hint -->
        <div class="mt-6 flex flex-col items-center pointer-events-auto">
          <button (click)="goBack()" class="w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <p class="text-white/40 text-xs mt-2">Appuyez pour fermer</p>
        </div>
      </div>

      <!-- Manual Entry Modal -->
      @if (showManualEntry()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end" (click)="showManualEntry.set(false)">
          <div class="bg-white w-full rounded-t-3xl p-6 pb-10 animate-slide-up" (click)="$event.stopPropagation()">
            <div class="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Saisie manuelle</h3>
            <p class="text-gray-500 text-sm mb-6">Entrez le code du billet</p>
            
            <input 
              type="text" 
              [(ngModel)]="manualCode"
              placeholder="Ex: TICKET-001"
              class="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg"
              autofocus
            />
            
            <div class="flex gap-3 mt-6">
              <button 
                (click)="showManualEntry.set(false)"
                class="flex-1 px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button 
                (click)="submitManualCode()"
                [disabled]="!manualCode() || isProcessing()"
                class="flex-1 px-6 py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                @if (isProcessing()) {
                  <svg class="animate-spin w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                } @else {
                  Valider
                }
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-up {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    .animate-slide-up {
      animation: slide-up 0.3s ease-out;
    }
    @keyframes scan {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(224px); }
    }
    .animate-scan {
      animation: scan 2s ease-in-out infinite;
    }
    /* Hide all default html5-qrcode UI elements */
    :host ::ng-deep #qr-reader {
      border: none !important;
      background: transparent !important;
    }
    :host ::ng-deep #qr-reader video {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
    }
    :host ::ng-deep #qr-reader__scan_region {
      display: none !important;
    }
    :host ::ng-deep #qr-reader__dashboard {
      display: none !important;
    }
    :host ::ng-deep #qr-reader__dashboard_section {
      display: none !important;
    }
    :host ::ng-deep #qr-reader__dashboard_section_csr {
      display: none !important;
    }
    :host ::ng-deep #qr-reader__dashboard_section_swaplink {
      display: none !important;
    }
    :host ::ng-deep #qr-reader__status_span {
      display: none !important;
    }
    :host ::ng-deep #qr-reader__camera_selection {
      display: none !important;
    }
    :host ::ng-deep #qr-reader__filescan_input {
      display: none !important;
    }
    :host ::ng-deep #qr-reader > div:not(:first-child) {
      display: none !important;
    }
    /* Hide the shaded region / scanning box from the library */
    :host ::ng-deep #qr-shaded-region {
      display: none !important;
    }
    :host ::ng-deep [id^="qr-shaded"] {
      display: none !important;
    }
    :host ::ng-deep #qr-reader canvas {
      display: none !important;
    }
    :host ::ng-deep #qr-reader img {
      display: none !important;
    }
  `]
})
export class ScannerComponent implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly scannerService = inject(ScannerService);
  
  private html5QrCode: Html5Qrcode | null = null;
  private isScanning = false;

  qrReader = viewChild<ElementRef>('qrReader');
  
  showManualEntry = signal(false);
  manualCode = signal('');
  isProcessing = signal(false);
  cameraError = signal<string | null>(null);

  async ngAfterViewInit(): Promise<void> {
    await this.startCamera();
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  private async startCamera(): Promise<void> {
    try {
      this.html5QrCode = new Html5Qrcode('qr-reader');
      
      const config = {
        fps: 10,
        qrbox: undefined, // Disable default scanning box
        aspectRatio: 1.0,
        disableFlip: false,
      };

      await this.html5QrCode.start(
        { facingMode: 'environment' },
        config,
        async (decodedText) => {
          if (!this.isScanning) {
            this.isScanning = true;
            await this.handleScan(decodedText);
          }
        },
        () => {} // Ignore errors during scanning
      );
    } catch (err) {
      console.error('Camera error:', err);
      this.cameraError.set('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    }
  }

  private async stopCamera(): Promise<void> {
    if (this.html5QrCode) {
      try {
        await this.html5QrCode.stop();
        this.html5QrCode.clear();
      } catch (err) {
        console.error('Error stopping camera:', err);
      }
      this.html5QrCode = null;
    }
  }

  private async handleScan(code: string): Promise<void> {
    this.isProcessing.set(true);
    
    // Vibration feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    await this.scannerService.scanTicket(code);
    await this.stopCamera();
    this.router.navigate(['/result']);
  }

  goBack(): void {
    this.stopCamera();
    this.router.navigate(['/dashboard']);
  }

  async submitManualCode(): Promise<void> {
    if (!this.manualCode() || this.isProcessing()) return;
    
    this.isProcessing.set(true);
    await this.scannerService.scanTicket(this.manualCode());
    await this.stopCamera();
    this.showManualEntry.set(false);
    this.router.navigate(['/result']);
  }
}
