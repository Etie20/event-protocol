import { Injectable, signal, computed } from '@angular/core';
import { Event, EventPhase, DashboardStats, ActivityLog } from '../../models';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly _currentEvent = signal<Event | null>(null);
  private readonly _activePhase = signal<string>('cocktail');
  private readonly _activityLogs = signal<ActivityLog[]>([]);

  readonly currentEvent = this._currentEvent.asReadonly();
  readonly activePhase = this._activePhase.asReadonly();
  readonly activityLogs = this._activityLogs.asReadonly();

  readonly stats = computed<DashboardStats | null>(() => {
    const event = this._currentEvent();
    if (!event) return null;
    return {
      scannedCount: event.scannedGuests,
      totalExpected: event.totalGuests,
      validatedCount: event.validatedGuests,
      refusedCount: event.refusedGuests,
      progressPercent: Math.round((event.scannedGuests / event.totalGuests) * 100)
    };
  });

  constructor() {
    this.loadMockEvent();
  }

  private loadMockEvent(): void {
    this._currentEvent.set({
      id: 'evt-001',
      name: 'Mariage de Sarah & Marc',
      date: new Date('2024-06-24'),
      phases: [
        { id: 'ceremony', name: 'Cérémonie', isActive: false },
        { id: 'cocktail', name: 'Cocktail', isActive: true },
        { id: 'dinner', name: 'Dîner', isActive: false }
      ],
      totalGuests: 300,
      scannedGuests: 124,
      validatedGuests: 118,
      refusedGuests: 6
    });

    this._activityLogs.set([
      { id: '1', guestName: 'Alice Martin', table: 'Table 4', category: 'Invité standard', time: new Date(), status: 'validated' },
      { id: '2', guestName: 'Thomas Dubois', table: 'Table 8', category: 'VIP', time: new Date(), status: 'validated' },
      { id: '3', guestName: 'Inconnu', category: 'Billet non reconnu', time: new Date(), status: 'error' },
      { id: '4', guestName: 'Sophie Bernard', table: 'Table 2', category: 'Famille', time: new Date(), status: 'validated' }
    ]);
  }

  setActivePhase(phaseId: string): void {
    this._activePhase.set(phaseId);
  }

  addActivityLog(log: ActivityLog): void {
    this._activityLogs.update(logs => [log, ...logs]);
  }

  incrementScanned(validated: boolean): void {
    this._currentEvent.update(event => {
      if (!event) return event;
      return {
        ...event,
        scannedGuests: event.scannedGuests + 1,
        validatedGuests: validated ? event.validatedGuests + 1 : event.validatedGuests,
        refusedGuests: validated ? event.refusedGuests : event.refusedGuests + 1
      };
    });
  }
}
