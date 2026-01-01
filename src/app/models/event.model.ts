export interface Event {
  id: string;
  name: string;
  date: Date;
  phases: EventPhase[];
  totalGuests: number;
  scannedGuests: number;
  validatedGuests: number;
  refusedGuests: number;
}

export interface EventPhase {
  id: string;
  name: string;
  isActive: boolean;
}

export interface ActivityLog {
  id: string;
  guestName: string;
  guestPhoto?: string;
  table?: string;
  category: string;
  time: Date;
  status: 'validated' | 'error' | 'refused';
}

export interface DashboardStats {
  scannedCount: number;
  totalExpected: number;
  validatedCount: number;
  refusedCount: number;
  progressPercent: number;
}
