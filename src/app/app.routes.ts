import { VoiceCommandComponent } from './features/voice-command/voice-command.component';
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';


//import { LoginPageRoutingModule } from './path/to/login-page-routing.module' // Import AuthGuard


export const routes: Routes = [
  // Home route, protected by AuthGuard
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent), },

  // Login route
  { path: 'login', loadComponent: () => import('./features/auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/pages/register-page/register-page.component').then(m => m.RegisterPageComponent) },
  { path: 'register/plan', loadComponent: () => import('./features/auth/pages/plan-selection-page/plan-selection-page.component').then(m => m.PlanSelectionPageComponent) },

  { path: 'register/user-info', loadComponent: () => import('./features/auth/pages/user-info/user-info.component').then(m => m.UserInfoComponent) },

  // Register route


  { path: 'voice-command', loadComponent: () => import('./features/voice-command/voice-command.component').then(m => m.VoiceCommandComponent) },





  { path: '404', loadComponent: () => import('./core/components/not-found/not-found.component').then(m => m.NotFoundComponent) },
  { path: 'movies', loadChildren: () => import('./features/content/content.routes').then(m => m.CONTENT_ROUTES), canActivate: [AuthGuard] },
 // { path: 'movies', loadChildren: () => import('./features/content/content.routes').then(m => m.CONTENT_ROUTES) }, // Temporarily removed AuthGuard

  { path: 'tv-shows', loadChildren: () => import('./features/content/content.routes').then(m => m.CONTENT_ROUTES), canActivate: [AuthGuard] },
  ,{
    path: 'search',
    loadComponent: () => import('./features/content/search/search.component').then(m => m.SearchComponent)
    ,canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '404' }




];
