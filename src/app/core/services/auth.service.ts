import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  photo?: string | null;
}

interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    profilePictureUrl: string | null;
    bio: string | null;
    isVerified: boolean;
    createdAt: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _user = signal<User | null>(null);
  private readonly _isAuthenticated = signal(false);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly userInitials = computed(() => this._user()?.initials ?? '');

  constructor() {
    // Restore session if exists
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this._user.set(user);
        this._isAuthenticated.set(true);
      } catch {
        this.logout();
      }
    }
  }

  async login(credentials: { email: string; password: string }): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      );

      const user = this.mapUser(response.user);
      this._user.set(user);
      this._isAuthenticated.set(true);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  }

  // Maintaining old methods for compatibility or until fully removed, but they won't really work with the new flow effectively unless we mock.
  // I will leave them as stubs or keep them if the user wants to switch back for testing.
  // But strictly speaking, the user wants to integrate the backend.

  logout(): void {
    this._user.set(null);
    this._isAuthenticated.set(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private mapUser(apiUser: LoginResponse['user']): User {
    return {
      id: apiUser.id,
      name: apiUser.fullName,
      email: apiUser.email,
      role: apiUser.role,
      photo: apiUser.profilePictureUrl,
      initials: this.getInitials(apiUser.fullName)
    };
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
