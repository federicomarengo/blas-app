// Google Sheets Configuration
// Replace these values with your actual Google Sheets setup

export const GOOGLE_SHEETS_CONFIG = {
  // Get this from Google Cloud Console
  API_KEY: 'AIzaSyDt4D5cUMdCQG-LLAl7ZKanLt3MgQ3Alc8',
  
  // Get this from your Google Sheets URL
  // Example: https://docs.google.com/spreadsheets/d/1ABC123.../edit
  // The SHEET_ID is: 1ABC123...
  SHEET_ID: '1QqkNXEo7ap8FGlUx5YFLysr3LSF6nzLCpwZxTEF072I',
  
  // Name of the sheet tab (worksheet) in your Google Sheets
  // If you haven't renamed the sheet tab, it's usually 'Sheet1' by default
  SHEET_NAME: 'Sheet1',
  
  // Column structure in your Google Sheets:
  // A: Month (string) - e.g., "January 2024"
  // B: Progress (number) - e.g., 75
  
  // Example Google Sheets structure:
  // | Month | Progress |
  // | January 2024 | 75 |
  // | February 2024 | 50 |
  // | March 2024 | 100 |
};
