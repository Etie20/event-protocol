import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event, DashboardStats, ActivityLog } from '../../models';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/events`;

  private readonly _currentEvent = signal<Event | null>(null);
  private readonly _events = signal<Event[]>([]); // List of all events
  private readonly _isLoading = signal(false);

  // Activity logs would likely need to be fetched per event or via websocket. 
  // For now keeping local state or empty until we know the API for activity.
  private readonly _activityLogs = signal<ActivityLog[]>([]);

  readonly currentEvent = this._currentEvent.asReadonly();
  readonly events = this._events.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly activityLogs = this._activityLogs.asReadonly();

  readonly stats = computed<DashboardStats | null>(() => {
    const event = this._currentEvent();
    if (!event) return null;
    return {
      scannedCount: event.scannedGuests || 0,
      totalExpected: event.capacity || event.totalGuests || 0,
      validatedCount: event.validatedGuests || 0,
      refusedCount: event.refusedGuests || 0,
      progressPercent: event.capacity ? Math.round(((event.scannedGuests || 0) / event.capacity) * 100) : 0
    };
  });

  async loadEvents(): Promise<void> {
    this._isLoading.set(true);
    try {
      const events = await firstValueFrom(this.http.get<Event[]>(this.baseUrl));
      this._events.set(events);
    } catch (error) {
      console.error('Failed to load events', error);
    } finally {
      this._isLoading.set(false);
    }
  }

  async loadEvent(id: string): Promise<void> {
    this._isLoading.set(true);
    try {
      const event = await firstValueFrom(this.http.get<Event>(`${this.baseUrl}/${id}`));
      // Initialize Frontend-specific counters if they are missing from API or need reset
      // The API response shows standard fields, but the prompt implies scanning happens locally/synced.
      // We'll trust the API returns fresh data, or default to 0.
      this._currentEvent.set({
        ...event,
        scannedGuests: event.scannedGuests ?? 0,
        validatedGuests: event.validatedGuests ?? 0,
        refusedGuests: event.refusedGuests ?? 0,
        totalGuests: event.capacity
      });
    } catch (error) {
      console.error('Failed to load event', error);
      this._currentEvent.set(null);
    } finally {
      this._isLoading.set(false);
    }
  }

  // TODO: Implement syncing scan results back to backend
  incrementScanned(validated: boolean): void {
    this._currentEvent.update(event => {
      if (!event) return event;
      return {
        ...event,
        scannedGuests: (event.scannedGuests || 0) + 1,
        validatedGuests: validated ? (event.validatedGuests || 0) + 1 : (event.validatedGuests || 0),
        refusedGuests: validated ? (event.refusedGuests || 0) : (event.refusedGuests || 0) + 1
      };
    });
  }

  addActivityLog(log: ActivityLog): void {
    this._activityLogs.update(logs => [log, ...logs]);
  }
}
