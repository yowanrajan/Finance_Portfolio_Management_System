import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Portfolio } from '../../../core/models/portfolio.model';
import {MatTableDataSource} from "@angular/material/table";
import {PortfolioDetailsDialogComponent} from "../portfolio-details-dialog/portfolio-details-dialog.component";

@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.scss']
})
export class PortfolioListComponent implements OnInit {
  portfolios: MatTableDataSource<Portfolio> = new MatTableDataSource<Portfolio>();
  displayedColumns: string[] = ['name', 'totalValue', 'assetCount', 'lastUpdated', 'actions'];

  constructor(
    private portfolioService: PortfolioService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.loadPortfolios();
    this.portfolioService.getPortfolios().subscribe(data => {
      this.portfolios.data = data ?? [];
    });
  }

  loadPortfolios(): void {
    this.portfolioService.getPortfolios().subscribe();
  }

  createPortfolio(): void {
    this.router.navigate(['/portfolio/new']);
  }

  editPortfolio(id: string): void {
    this.router.navigate(['/portfolio/edit', id]);
  }

  viewPortfolioDetails(portfolio: Portfolio): void {
    // In a real app, we'd navigate to a detail view. For this demo, we'll just open a dialog
    const dialogRef = this.dialog.open(PortfolioDetailsDialogComponent, {
      width: '600px',
      data: { portfolio }
    });
  }

  getAssetCount(portfolio: Portfolio): number {
    return portfolio.assets.length;
  }
}
