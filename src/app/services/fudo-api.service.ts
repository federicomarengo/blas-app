import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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
  private apiSecret = API_CONFIG.apiSecret;
  private authToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(private http: HttpClient) { }

  // Authenticate and get token from Fudo API
  private authenticate(): Observable<string> {
    if (this.authToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return new Observable(observer => observer.next(this.authToken!));
    }

    const authUrl = 'https://auth.staging.fu.do/api'; // Using staging for testing
    const authData = {
      apiKey: this.apiKey,
      apiSecret: this.apiSecret
    };

    return this.http.post<any>(authUrl, authData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(
      map(response => {
        if (response.token) {
          this.authToken = response.token;
          // Set token expiry (assuming 1 hour, adjust based on API response)
          this.tokenExpiry = Date.now() + (response.expires_in || 3600) * 1000;
          return this.authToken;
        } else {
          throw new Error('No token received from authentication');
        }
      }),
      catchError(error => {
        console.error('Authentication failed:', error);
        throw new Error(`Authentication failed: ${error.message}`);
      })
    );
  }

  // Get headers with proper authentication token
  private getAuthenticatedHeaders(): Observable<HttpHeaders> {
    return this.authenticate().pipe(
      map(token => new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }))
    );
  }

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

  // Test API connection with proper Fudo authentication
  testConnection(): Observable<any> {
    const url = `${this.baseUrl}${API_CONFIG.endpoints.health}`;
    
    return this.getAuthenticatedHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(url, { headers });
      }),
      map(response => {
        return {
          success: true,
          message: 'Successfully connected to Fudo API with proper authentication',
          data: response,
          timestamp: new Date().toISOString(),
          note: 'Using proper Fudo API authentication flow (token-based)'
        };
      }),
      catchError(error => {
        console.error('Fudo API connection failed:', error);
        return throwError(() => new Error(`Fudo API connection failed: ${error.message}`));
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
