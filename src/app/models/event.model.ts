export interface Event {
  id: string;
  organizer: Organizer;
  title: string;
  description: string;
  type: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  locationName: string;
  locationAddress: string;
  locationLatitude: number;
  locationLongitude: number;
  coverImageUrl: string;
  capacity: number;
  ticketUrl: string;
  ticketDesign: TicketDesign;
  status: string;
  visibility: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  zones: Zone[];
  subSessions: SubSession[];
  online: boolean;

  // Computed/Frontend specific (mapped from API or calculated)
  scannedGuests?: number;
  validatedGuests?: number;
  refusedGuests?: number;
  totalGuests?: number; // Can be capacity or derived
  phases?: EventPhase[]; // Legacy support or mapped
}

export interface Organizer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  profilePictureUrl: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
}

export interface TicketDesign {
  color: string;
  showName: boolean;
  showQR: boolean;
  showEventName: boolean;
  showType: boolean;
}

export interface Zone {
  id: string;
  name: string;
  capacity: number;
  price: number;
}

export interface SubSession {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  speakerName: string;
  capacity: number;
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
