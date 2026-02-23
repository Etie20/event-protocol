import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ScanResult } from '../../models';

// Interface pour le body de la requête POST /api/scans
export interface ScanRequest {
  ticketId: string;
  eventId: string;
  gateId: string;
  isSuccessful: boolean;
  failureReason: string;
}

@Injectable({ providedIn: 'root' })
export class ScannerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://weplannerapi.enlighteninnovation.com/api/scans';

  private readonly _isScanning = signal(false);
  private readonly _lastResult = signal<ScanResult | null>(null);

  readonly isScanning = this._isScanning.asReadonly();
  readonly lastResult = this._lastResult.asReadonly();

  startScanning(): void {
    this._isScanning.set(true);
  }

  stopScanning(): void {
    this._isScanning.set(false);
  }

  async scanTicket(ticketId: string, eventId: string, gateId: string): Promise<ScanResult> {
    try {
      const scanRequest: ScanRequest = {
        ticketId,
        eventId,
        gateId,
        isSuccessful: true,
        failureReason: ''
      };

      const response = await firstValueFrom(
        this.http.post<any>(this.baseUrl, scanRequest)
      );

      // Construire le résultat de succès à partir de la réponse API
      const result: ScanResult = {
        success: true,
        status: 'authorized',
        message: 'Accès autorisé'
      };

      this._lastResult.set(result);
      return result;

    } catch (error: any) {
      // Gérer les différents types d'erreur de l'API
      const status = error?.status;
      const apiMessage = error?.error?.message || error?.error?.failureReason;

      let scanStatus: ScanResult['status'] = 'not_found';
      let message = 'Erreur lors du scan';
      let errorCode = '#E-500';

      if (status === 404) {
        scanStatus = 'not_found';
        message = apiMessage || 'Billet non reconnu';
        errorCode = '#E-404';
      } else if (status === 409 || (apiMessage && apiMessage.toLowerCase().includes('déjà'))) {
        scanStatus = 'already_scanned';
        message = apiMessage || 'Billet déjà scanné';
        errorCode = '#E-302';
      } else if (status === 403) {
        scanStatus = 'refused';
        message = apiMessage || 'Accès refusé';
        errorCode = '#E-403';
      }

      const result: ScanResult = {
        success: false,
        status: scanStatus,
        message,
        errorCode
      };

      this._lastResult.set(result);
      return result;
    }
  }

  clearResult(): void {
    this._lastResult.set(null);
  }
}
