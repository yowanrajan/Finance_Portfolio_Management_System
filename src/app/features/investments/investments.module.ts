import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestmentsRoutingModule } from './investments-routing.module';
import { InvestmentFormComponent } from './investment-form/investment-form.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    InvestmentFormComponent
  ],
  imports: [
    CommonModule,
    InvestmentsRoutingModule,
    SharedModule
  ]
})
export class InvestmentsModule { }
