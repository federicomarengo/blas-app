import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GoogleSheetsService, ProgressData } from '../../services/google-sheets.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  progressValue: number = 0;
  remainingDays: number = 0;
  countdownDays: number = 0;
  countdownHours: number = 0;
  messageFromSheet: string = '';
  isConnected: boolean = false;
  isLoading: boolean = false;
  private countdownInterval: any;

  constructor(private googleSheetsService: GoogleSheetsService) {}

  ngOnInit(): void {
    this.calculateRemainingDays();
    this.updateCountdown();
    this.startCountdownTimer();
    this.loadProgressFromStorage();
    this.loadProgressFromSheets();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  calculateRemainingDays(): void {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.remainingDays = lastDayOfMonth.getDate() - today.getDate();
  }

  updateCountdown(): void {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const timeDiff = endOfMonth.getTime() - now.getTime();
    
    if (timeDiff > 0) {
      this.countdownDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      this.countdownHours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    } else {
      this.countdownDays = 0;
      this.countdownHours = 0;
    }
  }

  startCountdownTimer(): void {
    // Update every hour (3600000 milliseconds)
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 3600000);
  }

  onProgressChange(value: number): void {
    this.progressValue = Math.max(0, Math.min(100, value));
    this.saveProgressToStorage();
    this.saveProgressToSheets();
  }

  getCurrentMonthName(): string {
    const date = new Date();
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  }

  getProgressBarClass(): string {
    if (this.progressValue <= 10) {
      return 'progress-red';
    } else if (this.progressValue <= 25) {
      return 'progress-red-orange';
    } else if (this.progressValue <= 40) {
      return 'progress-orange';
    } else if (this.progressValue <= 55) {
      return 'progress-orange-yellow';
    } else if (this.progressValue <= 70) {
      return 'progress-yellow';
    } else if (this.progressValue <= 85) {
      return 'progress-yellow-green';
    } else if (this.progressValue < 100) {
      return 'progress-green';
    } else {
      return 'progress-celebration';
    }
  }

  getProgressEmoji(): string {
    if (this.progressValue <= 5) {
      return '😭';
    } else if (this.progressValue <= 10) {
      return '😢';
    } else if (this.progressValue <= 20) {
      return '😔';
    } else if (this.progressValue <= 30) {
      return '😕';
    } else if (this.progressValue <= 40) {
      return '😐';
    } else if (this.progressValue <= 50) {
      return '🙂';
    } else if (this.progressValue <= 60) {
      return '😊';
    } else if (this.progressValue <= 70) {
      return '😄';
    } else if (this.progressValue <= 80) {
      return '😁';
    } else if (this.progressValue <= 90) {
      return '🤩';
    } else if (this.progressValue < 100) {
      return '🥳';
    } else {
      return '🎉';
    }
  }

  getProgressText(): string {
    if (this.progressValue === 100) {
      return 'Felicitaciones!!!';
    }
    return '';
  }

  saveProgressToStorage(): void {
    const progressData = {
      value: this.progressValue,
      timestamp: new Date().toISOString(),
      month: this.getCurrentMonthName()
    };
    localStorage.setItem('blas-progress', JSON.stringify(progressData));
  }

  loadProgressFromStorage(): void {
    const savedProgress = localStorage.getItem('blas-progress');
    if (savedProgress) {
      try {
        const progressData = JSON.parse(savedProgress);
        // Only load if it's from the current month
        if (progressData.month === this.getCurrentMonthName()) {
          this.progressValue = progressData.value;
        }
      } catch (error) {
        console.error('Error loading progress from storage:', error);
      }
    }
  }

  loadProgressFromSheets(): void {
    this.isLoading = true;
    const currentMonth = this.getCurrentMonthName();
    console.log('🔄 Loading progress from Google Sheets for month:', currentMonth);
    
    this.googleSheetsService.getProgress(currentMonth).subscribe({
      next: (response: any) => {
        console.log('✅ Google Sheets response:', response);
        if (response.values && response.values.length > 0) {
          console.log('📊 Found data rows:', response.values);
          // Search for current month in the data
          const rows = response.values;
          for (let i = 0; i < rows.length; i++) {
            const [month, progress, message] = rows[i];
            console.log(`🔍 Checking row ${i}: month="${month}", progress="${progress}", message="${message}"`);
            if (month === currentMonth) {
              console.log('🎯 Found matching month! Setting progress to:', progress);
              this.progressValue = parseInt(progress) || 0;
              this.messageFromSheet = message || '';
              this.isConnected = true;
              break;
            }
          }
        } else {
          console.log('⚠️ No data found in Google Sheets');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading from Google Sheets:', error);
        console.error('Error details:', error);
        this.isConnected = false;
        this.isLoading = false;
      }
    });
  }

  saveProgressToSheets(): void {
    this.googleSheetsService.updateProgress(
      this.progressValue, 
      this.getCurrentMonthName()
    ).subscribe({
      next: (response) => {
        console.log('Progress saved to Google Sheets:', response);
        this.isConnected = true;
      },
      error: (error) => {
        console.error('Error saving to Google Sheets:', error);
        this.isConnected = false;
      }
    });
  }

  refreshObjective(): void {
    this.loadProgressFromSheets();
  }

}