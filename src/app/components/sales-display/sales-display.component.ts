import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FudoApiService, SalesData } from '../../services/fudo-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sales-display',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-display.component.html',
  styleUrls: ['./sales-display.component.scss']
})
export class SalesDisplayComponent implements OnInit, OnDestroy {
  salesData: SalesData | null = null;
  loading = true;
  error: string | null = null;
  progressValue: number = 0;
  remainingDays: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(private fudoApiService: FudoApiService) { }

  ngOnInit(): void {
    this.loadSalesData();
    this.calculateRemainingDays();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadSalesData(): void {
    this.loading = true;
    this.error = null;
    this.salesData = null;

    this.subscription = this.fudoApiService.getCurrentMonthSales().subscribe({
      next: (data: SalesData) => {
        this.salesData = data;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Error loading sales data:', error);
      }
    });
  }

  refreshData(): void {
    this.loadSalesData();
  }

  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  getCurrentMonthName(): string {
    return new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  calculateRemainingDays(): void {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.remainingDays = lastDayOfMonth.getDate() - today.getDate();
  }

  onProgressChange(value: number): void {
    this.progressValue = Math.max(0, Math.min(100, value));
  }
}
