import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-area-bottom">
      <div class="flex items-center justify-around max-w-lg mx-auto h-16 relative">
        <!-- Accueil -->
        <a routerLink="/dashboard" routerLinkActive="active-nav" #rla1="routerLinkActive" 
           class="flex flex-col items-center justify-center w-16 h-full transition-colors"
           [class.text-primary]="rla1.isActive" [class.text-gray-400]="!rla1.isActive">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
          </svg>
          <span class="text-[10px] mt-0.5 font-medium">Accueil</span>
        </a>
        
        <!-- Liste -->
        <a routerLink="/guests" routerLinkActive="active-nav" #rla2="routerLinkActive"
           class="flex flex-col items-center justify-center w-16 h-full transition-colors"
           [class.text-primary]="rla2.isActive" [class.text-gray-400]="!rla2.isActive">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
          </svg>
          <span class="text-[10px] mt-0.5 font-medium">Liste</span>
        </a>
        
        <!-- Scanner FAB (center) -->
        <div class="relative flex items-center justify-center w-20">
          <a routerLink="/scanner" 
             class="absolute -top-8 w-16 h-16 bg-secondary rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-secondary/40 hover:shadow-secondary/60 hover:scale-105 transition-all duration-200">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 14.625v6m3-3h-6"/>
            </svg>
            <span class="text-[9px] text-white font-bold mt-0.5">SCANNER</span>
          </a>
        </div>
        
        <!-- Recherche -->
        <a routerLink="/search" routerLinkActive="active-nav" #rla3="routerLinkActive"
           class="flex flex-col items-center justify-center w-16 h-full transition-colors"
           [class.text-primary]="rla3.isActive" [class.text-gray-400]="!rla3.isActive">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
          </svg>
          <span class="text-[10px] mt-0.5 font-medium">Recherche</span>
        </a>
        
        <!-- Paramètres -->
        <a routerLink="/settings" routerLinkActive="active-nav" #rla4="routerLinkActive"
           class="flex flex-col items-center justify-center w-16 h-full transition-colors"
           [class.text-primary]="rla4.isActive" [class.text-gray-400]="!rla4.isActive">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="text-[10px] mt-0.5 font-medium">Paramètres</span>
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .safe-area-bottom {
      padding-bottom: env(safe-area-inset-bottom, 0);
    }
  `]
})
export class BottomNavComponent {}
