export interface Guest {
  id: string;
  name: string;
  photo?: string;
  category: GuestCategory;
  table?: string;
  ticketId: string;
  status: GuestStatus;
  scannedAt?: Date;
  scannedBy?: string;
  zone?: string;
}

export type GuestCategory = 'vip' | 'famille_marie' | 'famille_mariee' | 'ami' | 'collegue' | 'standard';

export type GuestStatus = 'pending' | 'validated' | 'refused' | 'already_scanned';

export interface ScanResult {
  success: boolean;
  status: 'authorized' | 'refused' | 'already_scanned' | 'not_found';
  guest?: Guest;
  message?: string;
  errorCode?: string;
  previousScan?: {
    time: Date;
    operator: string;
    zone: string;
  };
}
