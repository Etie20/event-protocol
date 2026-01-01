import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="bg-primary text-white px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        @if (showMenu()) {
          <button (click)="menuClick.emit()" class="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        }
        @if (showBack()) {
          <button (click)="backClick.emit()" class="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
        }
        <div class="flex items-center gap-2">
          @if (showLogo()) {
            <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          }
          <span class="font-semibold">{{ title() }}</span>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        @if (showNotification()) {
          <button class="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </button>
        }
        @if (showSettings()) {
          <button class="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
        }
        @if (userPhoto(); as photo) {
          <img [src]="photo" alt="User" class="w-8 h-8 rounded-full border-2 border-white/30 object-cover"/>
        } @else if (userInitials()) {
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
            {{ userInitials() }}
          </div>
        }
      </div>
    </header>
  `
})
export class HeaderComponent {
  title = input('WePlanner Protocol');
  showMenu = input(false);
  showBack = input(false);
  showLogo = input(false);
  showNotification = input(false);
  showSettings = input(false);
  userPhoto = input<string | undefined>();
  userInitials = input<string | undefined>();

  menuClick = output<void>();
  backClick = output<void>();
}
