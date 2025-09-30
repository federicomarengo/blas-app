import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FudoApiService } from '../../services/fudo-api.service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="support-container">
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

      <div class="support-header">
        <h1>Support & API Testing</h1>
        <p>Test your API connection and troubleshoot issues</p>
      </div>
      
      <div class="support-content">
        <div class="api-test-section">
          <h2>API Connection Test</h2>
          <p>Test the connection to the Fudo POS system API to ensure everything is working correctly.</p>
          
          <div class="test-controls">
            <button (click)="testConnection()" [disabled]="testing" class="test-btn">
              <span *ngIf="!testing">🔗 Test API Connection</span>
              <span *ngIf="testing">⏳ Testing Connection...</span>
            </button>
          </div>
          
          <div *ngIf="result" class="result success">
            <div class="result-header">
              <h3>✅ Connection Successful</h3>
              <span class="timestamp">{{ result.timestamp | date:'medium' }}</span>
            </div>
            <div class="result-content">
              <p><strong>Status:</strong> {{ result.message }}</p>
              <details>
                <summary>View Response Data</summary>
                <pre>{{ result.data | json }}</pre>
              </details>
            </div>
          </div>
          
          <div *ngIf="error" class="result error">
            <div class="result-header">
              <h3>❌ Connection Failed</h3>
              <span class="timestamp">{{ getCurrentTimestamp() | date:'medium' }}</span>
            </div>
            <div class="result-content">
              <p><strong>Error:</strong> {{ error }}</p>
              <div class="troubleshooting">
                <h4>Troubleshooting Tips:</h4>
                <ul>
                  <li>Check your internet connection</li>
                  <li>Verify the API endpoint is accessible</li>
                  <li>Ensure authentication credentials are correct</li>
                  <li>Check if the API service is running</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <h2>API Information</h2>
          <div class="info-cards">
            <div class="info-card">
              <h3>Endpoints Tested</h3>
              <ul>
                <li>https://dev.fu.do/api/health</li>
                <li>https://api.fudo.com/api/health</li>
                <li>https://fu.do/api/health</li>
                <li>https://dev.fu.do/api/sales</li>
                <li>https://api.fudo.com/api/sales</li>
              </ul>
            </div>
            
            <div class="info-card">
              <h3>Authentication Methods</h3>
              <ul>
                <li>Basic Authentication</li>
                <li>Bearer Token</li>
                <li>API Key in Header</li>
                <li>API Key in Query Parameter</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .support-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #ffffff;
      min-height: 100vh;
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

    .support-header {
      text-align: center;
      margin-bottom: 40px;
      padding: 40px 0;
      background: #000000;
      color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 800px;
    }

    .support-header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .support-header p {
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .support-content {
      display: grid;
      gap: 30px;
    }

    .api-test-section {
      background: #ffffff;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 2px solid #000000;
      width: 100%;
      max-width: 800px;
      text-align: center;
    }

    .api-test-section h2 {
      color: #000000;
      margin-bottom: 20px;
      font-size: 2rem;
      font-weight: 700;
    }

    .api-test-section p {
      color: #000000;
      margin-bottom: 30px;
      font-size: 1.2rem;
    }

    .test-controls {
      text-align: center;
      margin: 30px 0;
    }

    .test-btn {
      background: #000000;
      color: #ffffff;
      border: 2px solid #000000;
      padding: 18px 35px;
      border-radius: 10px;
      font-size: 1.2rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      min-width: 220px;
    }

    .test-btn:hover:not(:disabled) {
      background: #ffffff;
      color: #000000;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    }

    .test-btn:disabled {
      background: #666666;
      color: #ffffff;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .result {
      margin-top: 25px;
      padding: 20px;
      border-radius: 10px;
      border: 2px solid;
    }

    .result.success {
      background: #ffffff;
      border: 2px solid #000000;
      border-radius: 10px;
    }

    .result.error {
      background: #ffffff;
      border: 2px solid #000000;
      border-radius: 10px;
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .result-header h3 {
      margin: 0;
      font-size: 1.4rem;
      color: #000000;
      font-weight: 700;
    }

    .timestamp {
      font-size: 0.9rem;
      color: #666666;
      opacity: 0.8;
    }

    .result-content p {
      margin: 10px 0;
      font-size: 1.1rem;
      color: #000000;
    }

    details {
      margin-top: 15px;
    }

    summary {
      cursor: pointer;
      font-weight: 700;
      color: #000000;
      margin-bottom: 10px;
    }

    pre {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      overflow-x: auto;
      font-size: 0.9rem;
      border: 2px solid #000000;
      color: #000000;
    }

    .troubleshooting {
      margin-top: 15px;
      padding: 20px;
      background: #ffffff;
      border-radius: 10px;
      border: 2px solid #000000;
    }

    .troubleshooting h4 {
      margin-bottom: 15px;
      color: #000000;
      font-weight: 700;
    }

    .troubleshooting ul {
      margin: 0;
      padding-left: 20px;
    }

    .troubleshooting li {
      margin: 8px 0;
      color: #000000;
    }

    .info-section {
      background: #ffffff;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 2px solid #000000;
      width: 100%;
      max-width: 800px;
      text-align: center;
    }

    .info-section h2 {
      color: #000000;
      margin-bottom: 25px;
      font-size: 2rem;
      font-weight: 700;
    }

    .info-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .info-card {
      background: #ffffff;
      padding: 25px;
      border-radius: 10px;
      border: 2px solid #000000;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .info-card h3 {
      color: #000000;
      margin-bottom: 15px;
      font-size: 1.3rem;
      font-weight: 700;
    }

    .info-card ul {
      margin: 0;
      padding-left: 20px;
    }

    .info-card li {
      margin: 8px 0;
      color: #000000;
      font-size: 0.95rem;
    }

    @media (max-width: 768px) {
      .support-container {
        padding: 15px;
      }

      .support-header h1 {
        font-size: 2rem;
      }

      .support-header p {
        font-size: 1rem;
      }

      .api-test-section, .info-section {
        padding: 20px;
      }

      .result-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .info-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SupportComponent implements OnInit {
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

  getCurrentTimestamp(): Date {
    return new Date();
  }
}
