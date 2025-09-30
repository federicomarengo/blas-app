import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';

export interface SalesData {
  total: number;
  currency: string;
  period: string;
  transactions: number;
}

export interface ApiResponse {
  success: boolean;
  data: any;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FudoApiService {
  private baseUrl = API_CONFIG.baseUrl;
  private apiKey = API_CONFIG.apiKey;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    // Try different authentication methods
    return new HttpHeaders({
      'X-API-Key': this.apiKey,
      'X-API-Secret': API_CONFIG.apiSecret,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private getBearerHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private getBasicAuthHeaders(): HttpHeaders {
    const credentials = btoa(`${this.apiKey}:${API_CONFIG.apiSecret}`);
    return new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('Fudo API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getCurrentMonthSales(): Observable<SalesData> {
    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const startDate = firstDay.toISOString().split('T')[0];
    const endDate = lastDay.toISOString().split('T')[0];
    
    const url = `${this.baseUrl}${API_CONFIG.endpoints.sales}`;
    const params = {
      start_date: startDate,
      end_date: endDate,
      format: 'json'
    };

    return this.http.get<ApiResponse>(url, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      map(response => {
        if (response.success && response.data) {
          return {
            total: response.data.total_sales || 0,
            currency: response.data.currency || 'USD',
            period: `${startDate} to ${endDate}`,
            transactions: response.data.transaction_count || 0
          };
        } else {
          throw new Error(response.message || 'Failed to fetch sales data');
        }
      }),
      catchError(this.handleError)
    );
  }

  getSalesByDateRange(startDate: string, endDate: string): Observable<SalesData> {
    const url = `${this.baseUrl}${API_CONFIG.endpoints.sales}`;
    const params = {
      start_date: startDate,
      end_date: endDate,
      format: 'json'
    };

    return this.http.get<ApiResponse>(url, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      map(response => {
        if (response.success && response.data) {
          return {
            total: response.data.total_sales || 0,
            currency: response.data.currency || 'USD',
            period: `${startDate} to ${endDate}`,
            transactions: response.data.transaction_count || 0
          };
        } else {
          throw new Error(response.message || 'Failed to fetch sales data');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Test API connection with different auth methods
  testConnection(): Observable<any> {
    const url = `${this.baseUrl}${API_CONFIG.endpoints.health}`;
    
    // Try X-API-Key method first
    return this.http.get<any>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(() => {
        // If X-API-Key fails, try Bearer token
        return this.http.get<any>(url, {
          headers: this.getBearerHeaders()
        }).pipe(
          catchError(() => {
            // If Bearer fails, try Basic Auth
            return this.http.get<any>(url, {
              headers: this.getBasicAuthHeaders()
            });
          })
        );
      })
    );
  }

  // Test with a simple endpoint
  testSimpleEndpoint(): Observable<any> {
    const url = `${this.baseUrl}${API_CONFIG.endpoints.sales}`;
    
    return this.http.get<any>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(() => {
        return this.http.get<any>(url, {
          headers: this.getBearerHeaders()
        }).pipe(
          catchError(() => {
            return this.http.get<any>(url, {
              headers: this.getBasicAuthHeaders()
            });
          })
        );
      })
    );
  }
}
