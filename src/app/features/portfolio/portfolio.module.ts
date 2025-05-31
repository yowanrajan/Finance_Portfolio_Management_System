import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioRoutingModule } from './portfolio-routing.module';
import { PortfolioListComponent } from './portfolio-list/portfolio-list.component';
import { PortfolioFormComponent } from './portfolio-form/portfolio-form.component';
import { SharedModule } from '../../shared/shared.module';
import { PortfolioDetailsDialogComponent } from './portfolio-details-dialog/portfolio-details-dialog.component';

@NgModule({
  declarations: [
    PortfolioListComponent,
    PortfolioFormComponent,
    PortfolioDetailsDialogComponent
  ],
  imports: [
    CommonModule,
    PortfolioRoutingModule,
    SharedModule
  ]
})
export class PortfolioModule { }
