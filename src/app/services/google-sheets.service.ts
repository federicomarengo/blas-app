import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GOOGLE_SHEETS_CONFIG } from '../../config/google-sheets.config';

export interface ProgressData {
  value: number;
  timestamp: string;
  month: string;
  user?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  private readonly API_KEY = GOOGLE_SHEETS_CONFIG.API_KEY;
  private readonly SHEET_ID = GOOGLE_SHEETS_CONFIG.SHEET_ID;
  private readonly SHEET_NAME = GOOGLE_SHEETS_CONFIG.SHEET_NAME;
  
  private progressSubject = new BehaviorSubject<ProgressData | null>(null);
  public progress$ = this.progressSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get current progress from Google Sheets for specific month
  getProgress(month: string): Observable<any> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.SHEET_NAME}!A1:C100?key=${this.API_KEY}`;
    console.log('🔍 Google Sheets API URL:', url);
    console.log('📊 Looking for month:', month);
    console.log('📋 Sheet ID:', this.SHEET_ID);
    console.log('📄 Sheet Name:', this.SHEET_NAME);
    return this.http.get(url);
  }

  // Update progress in Google Sheets for current month
  updateProgress(progress: number, month: string): Observable<any> {
    // First, try to find and update existing row for this month
    return this.findAndUpdateMonthProgress(progress, month);
  }

  // Find existing month row and update it, or create new row
  private findAndUpdateMonthProgress(progress: number, month: string): Observable<any> {
    return new Observable(observer => {
      this.getProgress(month).subscribe({
        next: (response: any) => {
          if (response.values && response.values.length > 0) {
            // Find the row with the current month
            const rows = response.values;
            let monthRowIndex = -1;
            
            for (let i = 0; i < rows.length; i++) {
              if (rows[i][0] === month) {
                monthRowIndex = i + 1; // +1 because Google Sheets is 1-indexed
                break;
              }
            }
            
            if (monthRowIndex > 0) {
              // Update existing row
              this.updateExistingRow(progress, monthRowIndex).subscribe({
                next: (result) => observer.next(result),
                error: (error) => observer.error(error)
              });
            } else {
              // Add new row
              this.addNewRow(progress, month).subscribe({
                next: (result) => observer.next(result),
                error: (error) => observer.error(error)
              });
            }
          } else {
            // No data, add new row
            this.addNewRow(progress, month).subscribe({
              next: (result) => observer.next(result),
              error: (error) => observer.error(error)
            });
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  // Update existing row
  private updateExistingRow(progress: number, rowIndex: number): Observable<any> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.SHEET_NAME}!B${rowIndex}?valueInputOption=USER_ENTERED&key=${this.API_KEY}`;
    return this.http.put(url, { values: [[progress]] });
  }

  // Add new row
  private addNewRow(progress: number, month: string): Observable<any> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.SHEET_NAME}!A:B:append?valueInputOption=USER_ENTERED&key=${this.API_KEY}`;
    return this.http.post(url, { values: [[month, progress]] });
  }

  // Update local progress subject
  updateLocalProgress(progress: ProgressData): void {
    this.progressSubject.next(progress);
  }
}
