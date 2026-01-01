import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HeaderComponent, GuestBadgeComponent } from '../../shared';
import { ScannerService } from '../../core';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [HeaderComponent, GuestBadgeComponent, DatePipe],
  template: `
    @if (result(); as r) {
      <div class="min-h-screen bg-gray-50">
        <app-header 
          title="WePlanner Protocol"
          [showBack]="true"
          [showSettings]="true"
          (backClick)="goBack()"
        />

        <div class="px-4 py-6">
          @if (r.status === 'authorized') {
            <div class="text-center mb-6">
              <div class="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-success/30">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h1 class="text-2xl font-bold text-gray-900">Accès Autorisé</h1>
              <p class="text-success text-sm flex items-center justify-center gap-1 mt-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Billet Valide
              </p>
            </div>

            <div class="card p-6 border-t-4 border-success">
              @if (r.guest; as guest) {
                <div class="text-center">
                  <div class="relative inline-block mb-4">
                    <img [src]="guest.photo || 'https://i.pravatar.cc/150'" alt="Guest" class="w-20 h-20 rounded-full border-4 border-primary object-cover"/>
                    <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-white">
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                  </div>
                  <h2 class="text-xl font-bold text-gray-900">{{ guest.name }}</h2>
                  <div class="mt-2">
                    <app-guest-badge [category]="guest.category" />
                  </div>
                </div>
                @if (guest.table) {
                  <div class="mt-6 bg-gray-50 rounded-xl p-4 text-center">
                    <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Placement Assigné</p>
                    <p class="text-2xl font-bold text-gray-900">{{ guest.table }}</p>
                  </div>
                }
              }
            </div>

            <button (click)="finish()" class="btn btn-success w-full mt-6">
              Terminer
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>

            <p class="text-center text-gray-400 text-sm mt-4">Fermeture auto dans {{ countdown() }}s</p>
          } @else if (r.status === 'already_scanned') {
            <div class="text-center mb-6">
              <div class="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-danger">
                <svg class="w-10 h-10 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h1 class="text-2xl font-bold text-danger uppercase">Attention</h1>
              <p class="text-gray-900 font-semibold mt-1">BILLET DÉJÀ SCANNÉ !</p>
            </div>

            @if (r.previousScan) {
              <div class="bg-danger/5 border border-danger/20 rounded-xl p-3 mb-4 text-center">
                <p class="text-danger text-sm">Scanné à {{ r.previousScan.time | date:'HH:mm' }}</p>
              </div>
            }

            <div class="card p-4 mb-4">
              <h3 class="text-sm font-semibold text-danger flex items-center gap-2 mb-4">DÉTAILS DE L'INCIDENT</h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Opérateur</span>
                  <span class="font-medium">{{ r.previousScan?.operator }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Zone</span>
                  <span class="font-medium">{{ r.previousScan?.zone }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Billet #</span>
                  <span class="font-medium">{{ r.guest?.ticketId }}</span>
                </div>
              </div>
            </div>

            @if (r.guest; as guest) {
              <div class="card p-4 flex items-center gap-4 mb-6">
                <img [src]="guest.photo || 'https://i.pravatar.cc/150'" alt="Guest" class="w-14 h-14 rounded-xl object-cover"/>
                <div>
                  <p class="text-xs text-gray-400">PROPRIÉTAIRE DU BILLET</p>
                  <p class="font-semibold text-gray-900">{{ guest.name }}</p>
                </div>
              </div>
            }

            <button (click)="scanAnother()" class="btn btn-secondary w-full">SCANNER UN AUTRE BILLET</button>
            <button class="w-full text-center text-gray-400 text-sm mt-4">Forcer la validation (Superviseur requis)</button>
          } @else {
            <div class="text-center mb-6">
              <div class="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-danger">
                <svg class="w-10 h-10 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                </svg>
              </div>
              <h1 class="text-2xl font-bold text-danger uppercase">Accès Refusé</h1>
              <p class="text-gray-600 mt-1">{{ r.message }}</p>
              <p class="text-gray-400 text-sm">Code erreur: {{ r.errorCode }}</p>
            </div>

            <div class="card p-4 bg-blue-50 border-blue-200 mb-6">
              <p class="text-sm text-blue-800">Veuillez vérifier l'identité du visiteur ou contacter le superviseur de zone.</p>
            </div>

            <button (click)="scanAnother()" class="btn btn-secondary w-full">SCANNER UN AUTRE BILLET</button>
            <button class="w-full text-center text-gray-400 text-sm mt-4">Signaler un problème</button>
          }
        </div>
      </div>
    }
  `
})
export class ResultComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly scannerService = inject(ScannerService);
  private countdownInterval?: ReturnType<typeof setInterval>;

  result = this.scannerService.lastResult;
  countdown = signal(5);

  ngOnInit(): void {
    if (!this.result()) {
      this.router.navigate(['/scanner']);
      return;
    }
    if (this.result()?.status === 'authorized') {
      this.startCountdown();
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  private startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      this.countdown.update(v => v - 1);
      if (this.countdown() <= 0) this.finish();
    }, 1000);
  }

  goBack(): void {
    this.scannerService.clearResult();
    this.router.navigate(['/scanner']);
  }

  finish(): void {
    this.scannerService.clearResult();
    this.router.navigate(['/dashboard']);
  }

  scanAnother(): void {
    this.scannerService.clearResult();
    this.router.navigate(['/scanner']);
  }
}
