import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/amortizations' },
//   { path: '', loadChildren: () => import('./amortizations/amortizations.module').then(m => m.AmortizationsModule) },
  { path: 'amortizations', loadChildren: () => import('./amortizations/amortizations.module').then(m => m.AmortizationsModule) },
  { path: 'assets', loadChildren: () => import('./assets/assets.module').then(m => m.AssetsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
