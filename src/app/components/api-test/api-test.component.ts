import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FudoApiService } from '../../services/fudo-api.service';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="api-test">
      <h3>API Connection Test</h3>
      <button (click)="testConnection()" [disabled]="testing">
        {{ testing ? 'Testing...' : 'Test API Connection' }}
      </button>
      
      <div *ngIf="result" class="result">
        <h4>Result:</h4>
        <pre>{{ result | json }}</pre>
      </div>
      
      <div *ngIf="error" class="error">
        <h4>Error:</h4>
        <p>{{ error }}</p>
      </div>
    </div>
  `,
  styles: [`
    .api-test {
      padding: 20px;
      border: 1px solid #ddd;
      margin: 20px 0;
      border-radius: 8px;
    }
    .result, .error {
      margin-top: 20px;
      padding: 10px;
      border-radius: 4px;
    }
    .result {
      background: #f0f8ff;
      border: 1px solid #b0d4f1;
    }
    .error {
      background: #ffe6e6;
      border: 1px solid #ffb3b3;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    button {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class ApiTestComponent implements OnInit {
  testing = false;
  result: any = null;
  error: string | null = null;

  constructor(private fudoApiService: FudoApiService) { }

  ngOnInit(): void {
    // Auto-test on component load
    this.testConnection();
  }

  testConnection(): void {
    this.testing = true;
    this.result = null;
    this.error = null;

    console.log('Testing API connection with multiple URLs and auth methods...');
    
    this.fudoApiService.testConnection().subscribe({
      next: (data) => {
        this.result = { 
          message: 'API connection successful!', 
          data: data,
          timestamp: new Date().toISOString(),
          note: 'Check console for detailed URL and auth method used'
        };
        this.testing = false;
        console.log('✅ API Connection Successful:', data);
      },
      error: (err) => {
        this.error = `All URL and authentication combinations failed. Last error: ${err.message}`;
        this.testing = false;
        console.error('❌ All API tests failed:', err);
        console.log('Tried URLs:', [
          'https://dev.fu.do/api/health',
          'https://api.fudo.com/api/health', 
          'https://fu.do/api/health',
          'https://dev.fu.do/api/sales',
          'https://api.fudo.com/api/sales'
        ]);
      }
    });
  }
}
