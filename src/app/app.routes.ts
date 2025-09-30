import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SupportComponent } from './components/support/support.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'support', component: SupportComponent },
  { path: '**', redirectTo: '' }
];
