import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../core';
import { GuestBadgeComponent } from '../../shared/components/guest-badge/guest-badge.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, GuestBadgeComponent, BottomNavComponent],
  template: `
    <div class="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900">
      <!-- Search Header -->
      <div class="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm safe-top">
        <div class="p-4">
          <h1 class="text-xl font-bold mb-3">Rechercher</h1>
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
            </svg>
            <input 
              type="text" 
              [(ngModel)]="searchQuery"
              placeholder="Nom, Ticket ID..."
              class="w-full bg-gray-100 border-none rounded-xl pl-12 pr-4 py-3 text-base focus:ring-2 focus:ring-primary focus:bg-white transition-all"
            />
            @if (searchQuery()) {
              <button (click)="searchQuery.set('')" class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="p-4 space-y-3">
        @if (filteredGuests().length === 0 && searchQuery()) {
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-gray-500 font-medium">Aucun invité trouvé</p>
            <p class="text-sm text-gray-400 mt-1">Essayez une autre recherche</p>
          </div>
        } @else if (filteredGuests().length === 0 && !searchQuery()) {
           <div class="flex flex-col items-center justify-center py-12 text-center opacity-50">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
              </svg>
            </div>
            <p class="text-gray-500 font-medium">Commencez la recherche</p>
          </div>
        }

        @for (guest of filteredGuests(); track guest.id) {
          <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-transform">
            <div class="relative">
              <img [src]="guest.photo || 'https://i.pravatar.cc/150?u=' + guest.id" class="w-12 h-12 rounded-full object-cover border border-gray-100"/>
              @if (guest.status === 'validated') {
                <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              }
            </div>
            
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-900 truncate">{{ guest.name }}</h3>
              <p class="text-xs text-gray-500 truncate mb-1">{{ guest.ticketId }}</p>
              <app-guest-badge [category]="guest.category" />
            </div>

            <div class="flex flex-col gap-2">
               @if (guest.table) {
                <span class="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-600 whitespace-nowrap text-center">
                  {{ guest.table }}
                </span>
               }
            </div>
          </div>
        }
      </div>
      
      <app-bottom-nav />
    </div>
  `,
  styles: [`
    .safe-top {
      padding-top: env(safe-area-inset-top);
    }
  `]
})
export class SearchComponent {
  private readonly eventService = inject(EventService);

  searchQuery = signal('');

  // Mocking full guest list for search since EventService doesn't expose all guests directly in this simplified version
  // In a real app, this would come from a Signal<Guest[]> in EventService
  private allGuests = signal<{ id: string, name: string, ticketId: string, category: any, status: string, table: string | null, photo?: string }[]>([
    { id: '1', name: 'Alice Martin', ticketId: 'TKT-001', category: 'standard', status: 'validated', table: 'Table 4' },
    { id: '2', name: 'Thomas Dubois', ticketId: 'TKT-002', category: 'vip', status: 'validated', table: 'Table 1' },
    { id: '3', name: 'Sophie Bernard', ticketId: 'TKT-003', category: 'famille_marie', status: 'pending', table: 'Table 2' },
    { id: '4', name: 'Jean Dupont', ticketId: 'TKT-004', category: 'ami', status: 'refused', table: null },
    { id: '5', name: 'Marie Curie', ticketId: 'TKT-005', category: 'vip', status: 'pending', table: 'Table 1' },
  ]);

  filteredGuests = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];

    return this.allGuests().filter(g =>
      g.name.toLowerCase().includes(query) ||
      g.ticketId.toLowerCase().includes(query)
    );
  });
}
