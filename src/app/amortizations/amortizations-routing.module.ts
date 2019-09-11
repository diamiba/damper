import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AmortizationComponent } from './amortization/amortization.component';


const routes: Routes = [
    { path: '', component: AmortizationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmortizationsRoutingModule { }
