import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GoogleSheetsService, ProgressData } from '../../services/google-sheets.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- Navigation -->
      <nav class="navigation">
        <div class="nav-brand">
          <div class="logo-container">
            <div class="logo-image">
              <img src="assets/images/blas_header.png" alt="Blas Logo" class="header-logo">
            </div>
          </div>
        </div>
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/support" routerLinkActive="active">Support</a>
        </div>
      </nav>

      <!-- Remaining Days Banner -->
      <div class="remaining-days-banner">
        <div class="remaining-days-content">
          <span class="remaining-days-label">Días restantes en {{ getCurrentMonthName() }}:</span>
          <span class="remaining-days-count">{{ remainingDays }}</span>
        </div>
      </div>

      <!-- Progress Bar Section -->
      <div class="progress-section">
        <h2 class="progress-title">Objetivo grupal</h2>
        <div class="connection-status">
          <span *ngIf="isLoading" class="status-loading">🔄 Cargando desde Google Sheets...</span>
          <span *ngIf="isConnected && !isLoading" class="status-connected">✅ Conectado a Google Sheets</span>
          <span *ngIf="!isConnected && !isLoading" class="status-disconnected">❌ Solo almacenamiento local</span>
        </div>
        <div class="progress-container">
          <div class="progress-bar-wrapper">
            <div class="progress-bar">
              <div class="progress-fill" 
                   [style.width.%]="progressValue"
                   [class]="getProgressBarClass()">
                <div class="progress-emoji">{{ getProgressEmoji() }}</div>
              </div>
            </div>
          </div>
          <div class="progress-controls">
            <label for="progress-input" class="progress-label">Establecer progreso (0-100):</label>
            <input 
              id="progress-input"
              type="number" 
              [(ngModel)]="progressValue" 
              (ngModelChange)="onProgressChange($event)"
              min="0" 
              max="100" 
              class="progress-input"
              placeholder="Ingrese valor de progreso">
            <div *ngIf="getProgressText()" class="celebration-text">{{ getProgressText() }}</div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: #ffffff;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .navigation {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ffffff;
      border: 2px solid #000000;
      padding: 20px 30px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      margin-bottom: 30px;
      width: 100%;
      max-width: 1200px;
      position: relative;
    }

    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-image {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-logo {
      height: 100px;
      width: auto;
      max-width: 300px;
      transition: all 0.3s ease;
      filter: none;
    }

    .header-logo:hover {
      transform: scale(1.05);
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }

    .brand-text h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 2.5rem;
      font-weight: 900;
      letter-spacing: 2px;
    }

    .tagline {
      color: #7f8c8d;
      margin: 0;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 1px;
      opacity: 0.8;
    }

    .nav-links {
      display: flex;
      gap: 20px;
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
    }

    .nav-links a {
      text-decoration: none;
      color: #000000;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 8px;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .nav-links a:hover {
      color: #ffffff;
      background: #000000;
      border-color: #000000;
    }

    .nav-links a.active {
      color: #ffffff;
      background: #000000;
      border-color: #000000;
    }

    // Remaining Days Banner
    .remaining-days-banner {
      background: #dc3545;
      color: #ffffff;
      padding: 25px 0;
      margin-bottom: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(220, 53, 69, 0.3);
      animation: slideInDown 0.6s ease-out;
      width: 100%;
      max-width: 800px;
      text-align: center;
    }

    .remaining-days-content {
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
      flex-wrap: wrap;
    }

    .remaining-days-label {
      font-size: 1.3rem;
      font-weight: 600;
      color: #ffffff;
    }

    .remaining-days-count {
      font-size: 2.5rem;
      font-weight: bold;
      background: #ffffff;
      color: #000000;
      padding: 15px 30px;
      border-radius: 10px;
      border: 2px solid #ffffff;
      min-width: 80px;
      text-align: center;
      animation: pulse 2s infinite;
    }

    // Progress Bar Section
    .progress-section {
      background: #ffffff;
      padding: 40px;
      border-radius: 10px;
      margin-bottom: 30px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 2px solid #000000;
      width: 100%;
      max-width: 800px;
      text-align: center;
    }

    .progress-title {
      font-size: 2.2rem;
      color: #000000;
      margin-bottom: 15px;
      font-weight: 700;
      text-align: center;
    }

    .connection-status {
      text-align: center;
      margin-bottom: 20px;
    }

    .status-loading {
      color: #ffa500;
      font-weight: 600;
    }

    .status-connected {
      color: #28a745;
      font-weight: 600;
    }

    .status-disconnected {
      color: #dc3545;
      font-weight: 600;
    }

    .progress-container {
      display: flex;
      flex-direction: column;
      gap: 25px;
      align-items: center;
    }

    .progress-bar-wrapper {
      width: 100%;
      max-width: 600px;
    }

    .progress-bar {
      position: relative;
      background: #f8f9fa;
      border-radius: 30px;
      height: 50px;
      overflow: hidden;
      box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.1);
      border: 2px solid #e9ecef;
    }

    .progress-fill {
      height: 100%;
      border-radius: 30px;
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      &.progress-red {
        background: linear-gradient(90deg, #dc3545, #c82333);
      }

      &.progress-orange {
        background: linear-gradient(90deg, #fd7e14, #e55a00);
      }

      &.progress-green {
        background: linear-gradient(90deg, #28a745, #1e7e34);
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        animation: shimmer 2s infinite;
      }
    }

    .progress-emoji {
      font-size: 1.5rem;
      z-index: 2;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .celebration-text {
      font-size: 1.5rem;
      font-weight: bold;
      color: #28a745;
      text-align: center;
      margin-top: 15px;
      animation: celebration 1s ease-in-out infinite alternate;
      text-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
    }

    .progress-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      width: 100%;
      max-width: 400px;
    }

    .progress-label {
      font-size: 1.3rem;
      color: #000000;
      font-weight: 700;
      text-align: center;
      margin-bottom: 15px;
    }

    .progress-input {
      width: 100%;
      max-width: 300px;
      padding: 15px 20px;
      border: 2px solid #000000;
      border-radius: 10px;
      font-size: 1.1rem;
      text-align: center;
      transition: all 0.3s ease;
      background: #ffffff;
      color: #000000;
      
      &:focus {
        outline: none;
        border-color: #000000;
        box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
      }
      
      &::placeholder {
        color: #666666;
      }
    }


    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    @keyframes shimmer {
      0% {
        left: -100%;
      }
      100% {
        left: 100%;
      }
    }

    @keyframes celebration {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(1.1);
      }
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 15px;
      }

      .navigation {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .nav-links {
        justify-content: center;
      }

      .remaining-days-content {
        flex-direction: column;
        gap: 10px;
      }

      .remaining-days-count {
        font-size: 2rem;
        padding: 10px 20px;
      }

      .progress-section, .quick-actions {
        padding: 20px;
      }

      .progress-bar {
        height: 35px;
      }

      .action-buttons {
        flex-direction: column;
        align-items: center;
      }

      .action-btn {
        width: 100%;
        max-width: 300px;
        justify-content: center;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  progressValue: number = 0;
  remainingDays: number = 0;
  isConnected: boolean = false;
  isLoading: boolean = false;

  constructor(private googleSheetsService: GoogleSheetsService) {}

  ngOnInit(): void {
    this.calculateRemainingDays();
    this.loadProgressFromStorage();
    this.loadProgressFromSheets();
  }

  calculateRemainingDays(): void {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.remainingDays = lastDayOfMonth.getDate() - today.getDate();
  }

  onProgressChange(value: number): void {
    this.progressValue = Math.max(0, Math.min(100, value));
    this.saveProgressToStorage();
    this.saveProgressToSheets();
  }

  getCurrentMonthName(): string {
    return new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  getProgressBarClass(): string {
    if (this.progressValue <= 30) {
      return 'progress-red';
    } else if (this.progressValue <= 70) {
      return 'progress-orange';
    } else {
      return 'progress-green';
    }
  }

  getProgressEmoji(): string {
    if (this.progressValue <= 30) {
      return '😢';
    } else if (this.progressValue <= 70) {
      return '😐';
    } else if (this.progressValue < 100) {
      return '😊';
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
    
    this.googleSheetsService.getProgress(currentMonth).subscribe({
      next: (response: any) => {
        if (response.values && response.values.length > 0) {
          // Search for current month in the data
          const rows = response.values;
          for (let i = 0; i < rows.length; i++) {
            const [month, progress] = rows[i];
            if (month === currentMonth) {
              this.progressValue = parseInt(progress) || 0;
              this.isConnected = true;
              break;
            }
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading from Google Sheets:', error);
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

}
