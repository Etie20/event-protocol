import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ScannerService } from '../../core';
import { ScanSuccessComponent } from './components/scan-success/scan-success.component';
import { ScanErrorComponent } from './components/scan-error/scan-error.component';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [ScanSuccessComponent, ScanErrorComponent],
  template: `
    @if (result(); as r) {
      @if (r.status === 'authorized') {
        <app-scan-success
          [guest]="r.guest"
          [scanId]="r.guest?.ticketId"
          (finish)="finish()"
          (history)="viewHistory()"
        />
      } @else {
        <app-scan-error
          [guest]="r.guest"
          [errorCode]="r.errorCode"
          [errorMessage]="getErrorMessage(r)"
          [previousScan]="r.previousScan?.time"
          (scanAnother)="scanAnother()"
          (reportProblem)="reportProblem()"
        />
      }
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
    // Auto-close on success is handled potentially by user interaction now, 
    // but the original code had it. The new design has a "Terminer" button.
    // I will keep the auto-close logic but maybe increase time or remove it if the design implies manual interaction.
    // The design implies high fidelity manual interaction ("Terminer"), so I'll remove the auto-redirect for now to let them see the cool screen.
    // actually, the user said "Elle pourra aussi etre rajoutee sur les pages des listes d'utilisateurs", implying it's a view.
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  getErrorMessage(r: any): string {
    if (r.status === 'already_scanned') return 'ATTENTION : Billet DÉJÀ SCANNÉ !';
    return r.message || 'ACCÈS REFUSÉ';
  }

  viewHistory(): void {
    // Implement history view navigation if exists, or just log for now
    console.log('View history clicked');
  }

  reportProblem(): void {
    console.log('Report problem clicked');
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
