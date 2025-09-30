# Google Sheets Integration Setup Guide

## 📊 **Step 1: Create Google Sheets Document**

1. **Go to [sheets.google.com](https://sheets.google.com)**
2. **Create a new spreadsheet**
3. **Name it**: "Blas Progress Tracker"
4. **Create a sheet tab named**: "Progress"
5. **Set up columns**:
   - **Column A**: Month (text) - e.g., "January 2024"
   - **Column B**: Progress (number) - e.g., 75
6. **Add headers** in row 1:
   ```
   A1: Month
   B1: Progress
   ```

## 🔑 **Step 2: Get Google Sheets API Key**

1. **Go to [Google Cloud Console](https://console.cloud.google.com)**
2. **Create a new project** or select existing
3. **Enable Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. **Create API Key**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

## 📋 **Step 3: Get Sheet ID**

1. **Open your Google Sheets document**
2. **Copy the URL** (looks like):
   ```
   https://docs.google.com/spreadsheets/d/1ABC123DEF456.../edit
   ```
3. **Extract the Sheet ID** (the long string between `/d/` and `/edit`):
   ```
   Sheet ID: 1ABC123DEF456...
   ```

## ⚙️ **Step 4: Configure Your App**

1. **Open**: `src/config/google-sheets.config.ts`
2. **Replace the values**:
   ```typescript
   export const GOOGLE_SHEETS_CONFIG = {
     API_KEY: 'YOUR_ACTUAL_API_KEY_HERE',
     SHEET_ID: 'YOUR_ACTUAL_SHEET_ID_HERE',
     SHEET_NAME: 'Progress',
   };
   ```

## 🔒 **Step 5: Make Sheet Public (Optional)**

If you want to share progress across multiple users:

1. **Open your Google Sheets**
2. **Click "Share" button**
3. **Set to "Anyone with the link can view"**
4. **Copy the public URL**

## 🚀 **Step 6: Deploy to Vercel**

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add Google Sheets integration"
   git push
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy!

## 📱 **How It Works**

- **Automatic Sync**: Progress updates automatically to Google Sheets
- **Fallback**: If Google Sheets fails, it saves locally
- **Status Indicator**: Shows connection status in the app
- **Month-based**: Progress resets each month
- **Real-time**: Multiple users can see shared progress

## 🔧 **Troubleshooting**

### **API Key Issues**
- Make sure Google Sheets API is enabled
- Check API key permissions
- Verify the API key is correct

### **Sheet Access Issues**
- Ensure the sheet is accessible
- Check the Sheet ID is correct
- Verify the sheet tab name matches

### **CORS Issues**
- Google Sheets API handles CORS automatically
- No additional configuration needed

## 📊 **Example Google Sheets Structure**

| Month | Progress |
|-------|----------|
| January 2024 | 75 |
| February 2024 | 50 |
| March 2024 | 100 |

## 🎯 **Features**

✅ **Real-time Sync**: Updates Google Sheets instantly  
✅ **Offline Support**: Works without internet (local storage)  
✅ **Multi-user**: Share progress across team members  
✅ **Month Reset**: Automatic progress reset each month  
✅ **Status Indicator**: Shows connection status  
✅ **Error Handling**: Graceful fallback to local storage  

Your app will now sync progress with Google Sheets! 🎉
