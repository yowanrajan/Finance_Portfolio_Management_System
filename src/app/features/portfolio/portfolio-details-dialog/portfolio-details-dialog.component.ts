import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Portfolio } from '../../../core/models/portfolio.model';

@Component({
  selector: 'app-portfolio-details-dialog',
  templateUrl: './portfolio-details-dialog.component.html',
  styleUrls: ['./portfolio-details-dialog.component.scss']
})
export class PortfolioDetailsDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PortfolioDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { portfolio: Portfolio }
  ) {}

  ngOnInit() {
    console.log(this.data);
  }

  close(): void {
    this.dialogRef.close();
  }
}
