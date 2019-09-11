import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AmortizationsRoutingModule } from './amortizations-routing.module';
import { AmortizationComponent } from './amortization/amortization.component';


@NgModule({
  declarations: [AmortizationComponent],
  imports: [
    CommonModule,
    AmortizationsRoutingModule
  ]
})
export class AmortizationsModule { }
