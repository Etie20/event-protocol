import { Injectable, signal } from '@angular/core';
import { ScanResult, Guest } from '../../models';

@Injectable({ providedIn: 'root' })
export class ScannerService {
  private readonly _isScanning = signal(false);
  private readonly _lastResult = signal<ScanResult | null>(null);

  readonly isScanning = this._isScanning.asReadonly();
  readonly lastResult = this._lastResult.asReadonly();

  private mockGuests: Map<string, Guest> = new Map([
    ['TICKET-001', {
      id: 'g1', name: 'Jean Dupont', photo: 'https://i.pravatar.cc/150?img=11',
      category: 'famille_marie', table: 'TABLE 5', ticketId: 'TICKET-001', status: 'pending'
    }],
    ['TICKET-002', {
      id: 'g2', name: 'Marie Laurent', photo: 'https://i.pravatar.cc/150?img=5',
      category: 'vip', table: 'TABLE 1', ticketId: 'TICKET-002', status: 'validated',
      scannedAt: new Date(Date.now() - 120000), scannedBy: 'Sécurité Entrée A', zone: 'Accès VIP / Loge'
    }]
  ]);

  startScanning(): void {
    this._isScanning.set(true);
  }

  stopScanning(): void {
    this._isScanning.set(false);
  }

  async scanTicket(ticketCode: string): Promise<ScanResult> {
    await this.simulateDelay(800);
    
    const guest = this.mockGuests.get(ticketCode);
    
    if (!guest) {
      const result: ScanResult = {
        success: false,
        status: 'not_found',
        message: 'Billet non reconnu',
        errorCode: '#E-404'
      };
      this._lastResult.set(result);
      return result;
    }

    if (guest.status === 'validated') {
      const result: ScanResult = {
        success: false,
        status: 'already_scanned',
        guest,
        message: 'Billet déjà scanné',
        errorCode: '#E-302',
        previousScan: {
          time: guest.scannedAt!,
          operator: guest.scannedBy!,
          zone: guest.zone!
        }
      };
      this._lastResult.set(result);
      return result;
    }

    guest.status = 'validated';
    guest.scannedAt = new Date();
    
    const result: ScanResult = {
      success: true,
      status: 'authorized',
      guest,
      message: 'Accès autorisé'
    };
    this._lastResult.set(result);
    return result;
  }

  clearResult(): void {
    this._lastResult.set(null);
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
