import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Portfolio, Asset, AssetType } from '../../../core/models/portfolio.model';

@Component({
  selector: 'app-investment-form',
  templateUrl: './investment-form.component.html',
  styleUrls: ['./investment-form.component.scss']
})
export class InvestmentFormComponent implements OnInit {
  investmentForm: FormGroup;
  portfolios$: Observable<Portfolio[]>;
  isLoading = false;
  assetTypes = Object.values(AssetType);
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private portfolioService: PortfolioService,
    private snackBar: MatSnackBar
  ) {
    this.investmentForm = this.createInvestmentForm();
    this.portfolios$ = this.portfolioService.portfolios$;
  }

  ngOnInit(): void {
    // Load all portfolios
    this.portfolioService.getPortfolios().subscribe();
  }

  createInvestmentForm(): FormGroup {
    return this.fb.group({
      portfolioId: ['', Validators.required],
      type: [AssetType.STOCK, Validators.required],
      symbol: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      quantity: [null, [Validators.required, Validators.min(0.01)]],
      purchasePrice: [null, [Validators.required, Validators.min(0.01)]],
      purchaseDate: [new Date(), Validators.required]
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.investmentForm.invalid) {
      return;
    }

    const { portfolioId, ...assetData } = this.investmentForm.value;

    const newAsset: Asset = {
      ...assetData,
      purchaseDate: new Date(assetData.purchaseDate)
    };

    this.isLoading = true;

    this.portfolioService.addAsset(portfolioId, newAsset).subscribe(
      result => {
        this.snackBar.open('Investment added successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.snackBar.open('Error adding investment', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  // Helper method to show validation errors
  hasError(controlName: string, errorName: string): boolean {
    const control = this.investmentForm.get(controlName);
    return !!(control && control.hasError(errorName) && (control.dirty || control.touched || this.formSubmitted));
  }

  calculateEstimatedValue(): number {
    const quantity = this.investmentForm.get('quantity')?.value || 0;
    const price = this.investmentForm.get('purchasePrice')?.value || 0;
    return quantity * price;
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  // Form field value change handlers
  onAssetTypeChange(type: AssetType): void {
    // In a real app, we might adjust form validation or provide suggestions
    // based on the selected asset type
  }
}
