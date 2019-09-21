import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetsComponent } from './assets/assets.component';
import { AssetDetailsComponent } from './asset-details/asset-details.component';


const routes: Routes = [
    { path: '', component: AssetsComponent },
    { path: 'details/:assetId', component: AssetDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
