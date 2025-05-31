import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Portfolio, Asset, AssetType } from '../../../core/models/portfolio.model';

@Component({
  selector: 'app-portfolio-form',
  templateUrl: './portfolio-form.component.html',
  styleUrls: ['./portfolio-form.component.scss']
})
export class PortfolioFormComponent implements OnInit {
  portfolioForm: FormGroup;
  editMode = false;
  portfolioId: string | null = null;
  isLoading = false;
  assetTypes = Object.values(AssetType);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    private snackBar: MatSnackBar
  ) {
    this.portfolioForm = this.createPortfolioForm();
  }

  ngOnInit(): void {
    this.portfolioId = this.route.snapshot.paramMap.get('id');
    this.editMode = !!this.portfolioId;

    if (this.editMode && this.portfolioId) {
      this.loadPortfolio(this.portfolioId);
    }
  }

  createPortfolioForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      assets: this.fb.array([])
    });
  }

  loadPortfolio(id: string): void {
    this.isLoading = true;
    this.portfolioService.getPortfolio(id).subscribe(portfolio => {
      if (portfolio) {
        this.portfolioForm.patchValue({
          name: portfolio.name
        });

        // Clear existing assets
        this.assets.clear();

        // Add each asset to form array
        portfolio.assets.forEach(asset => {
          this.addAsset(asset);
        });
      }
      this.isLoading = false;
    });
  }

  get assets(): FormArray {
    return this.portfolioForm.get('assets') as FormArray;
  }

  createAssetForm(asset?: Asset): FormGroup {
    return this.fb.group({
      id: [asset?.id || ''],
      type: [asset?.type || AssetType.STOCK, Validators.required],
      symbol: [asset?.symbol || '', [Validators.required, Validators.maxLength(10)]],
      name: [asset?.name || '', [Validators.required, Validators.maxLength(100)]],
      quantity: [asset?.quantity || 0, [Validators.required, Validators.min(0.01)]],
      purchasePrice: [asset?.purchasePrice || 0, [Validators.required, Validators.min(0.01)]],
      purchaseDate: [asset?.purchaseDate || new Date(), Validators.required]
    });
  }

  addAsset(asset?: Asset): void {
    this.assets.push(this.createAssetForm(asset));
  }

  removeAsset(index: number): void {
    this.assets.removeAt(index);
  }

  onSubmit(): void {
    if (this.portfolioForm.invalid) {
      // Mark all fields as touched to trigger validation visually
      this.portfolioForm.markAllAsTouched();
      return;
    }

    const portfolioData: Portfolio = {
      ...this.portfolioForm.value,
      totalValue: this.calculateTotalValue(),
      createdDate: new Date(),
      lastUpdated: new Date()
    };

    this.isLoading = true;

    if (this.editMode && this.portfolioId) {
      // In a real app, we'd update the portfolio
      this.snackBar.open('Portfolio updated successfully', 'Close', { duration: 3000 });
      this.router.navigate(['/portfolio']);
    } else {
      this.portfolioService.createPortfolio(portfolioData).subscribe(
        result => {
          this.snackBar.open('Portfolio created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/portfolio']);
        },
        error => {
          this.snackBar.open('Error creating portfolio', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      );
    }
  }

  calculateTotalValue(): number {
    return this.assets.controls.reduce((total, control) => {
      const quantity = control.get('quantity')?.value || 0;
      const price = control.get('purchasePrice')?.value || 0;
      return total + (quantity * price);
    }, 0);
  }

  cancel(): void {
    this.router.navigate(['/portfolio']);
  }
}
