import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'assets', loadChildren: () => import('./assets/assets.module').then(m => m.AssetsModule) },
    { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) },
    { path: '**', redirectTo: '/assets' },
    { path: '', pathMatch: 'full', redirectTo: '/assets' },
    //   { path: '', loadChildren: () => import('./amortizations/amortizations.module').then(m => m.AmortizationsModule) },
    //   { path: 'amortizations', loadChildren: () => import('./amortizations/amortizations.module').then(m => m.AmortizationsModule) },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
