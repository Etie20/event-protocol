import { Injectable, signal, computed } from '@angular/core';

export interface User {
  id: string;
  name: string;
  initials: string;
  role: 'staff' | 'supervisor' | 'admin';
  photo?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<User | null>(null);
  private readonly _isAuthenticated = signal(false);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly userInitials = computed(() => this._user()?.initials ?? '');

  async loginWithCode(code: string): Promise<boolean> {
    await this.simulateDelay(500);
    
    if (code.length === 6) {
      this._user.set({
        id: 'u1',
        name: 'Jean Dupont',
        initials: 'JD',
        role: 'staff',
        photo: 'https://i.pravatar.cc/150?img=11'
      });
      this._isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  async loginWithQR(qrData: string): Promise<boolean> {
    await this.simulateDelay(500);
    this._user.set({
      id: 'u1',
      name: 'Staff Sécurité',
      initials: 'SS',
      role: 'staff'
    });
    this._isAuthenticated.set(true);
    return true;
  }

  logout(): void {
    this._user.set(null);
    this._isAuthenticated.set(false);
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
