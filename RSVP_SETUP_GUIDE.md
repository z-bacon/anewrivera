# 🎊 Wedding RSVP with Google Sheets - Complete Setup Guide

This guide will walk you through setting up a custom RSVP system for your wedding website that:
- ✅ Lets guests search for their name from your guest list
- ✅ Shows party members as checkboxes
- ✅ **No email required** from guests
- ✅ Saves all responses to Google Sheets
- ✅ Completely **FREE**
- ✅ Works with your static GitHub Pages site

---

## 📋 What You'll Need

1. A Google Account
2. Your wedding website files (already done! ✓)
3. Your guest list
4. About 15-20 minutes

---

## 🚀 Step-by-Step Setup

### **Step 1: Create Your Google Sheet**

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ Blank"** to create a new spreadsheet
3. Rename it to **"Wedding RSVP"** (click on "Untitled spreadsheet" at the top)
4. **Copy the Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
   ```
   Example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
   
   Save this ID - you'll need it later!

---

### **Step 2: Set Up the Google Apps Script**

1. In your Google Sheet, click **Tools** > **Script editor**
2. You'll see a code editor with some default code
3. **Delete all the existing code**
4. **Open the file `google-apps-script.js`** from your project folder
5. **Copy all the code** from that file
6. **Paste it** into the Script editor
7. Find this line near the top:
   ```javascript
   const SHEET_ID = 'YOUR_SHEET_ID_HERE';
   ```
8. Replace `YOUR_SHEET_ID_HERE` with your actual Sheet ID (from Step 1)
9. Click **File** > **Save** (or Ctrl+S / Cmd+S)
10. Name the project **"Wedding RSVP Script"**

---

### **Step 3: Create Sample Guest List (Optional but Recommended)**

Before deploying, let's create a sample guest list to make sure everything works:

1. In the Script editor, find the function dropdown (it says "Select function")
2. Select **`createSampleGuestList`**
3. Click the **▶️ Play/Run button**
4. You'll see a permission dialog - click **Review permissions**
5. Choose your Google account
6. Click **Advanced** > **Go to Wedding RSVP Script (unsafe)**
7. Click **Allow**
8. Go back to your spreadsheet - you should see a "GuestList" sheet with sample data!

---

### **Step 4: Add Your Real Guest Data**

Now replace the sample data with your actual guests:

**The "GuestList" sheet should have these columns:**

| ID | Guest Name | Party Member 1 | Party Member 2 | Party Member 3 | ... |
|----|------------|----------------|----------------|----------------|-----|
| 1  | John Smith | John Smith     | Jane Smith     | Tommy Smith    |     |
| 2  | Maria Garcia | Maria Garcia | Carlos Garcia  |                |     |
| 3  | David Lee  | David Lee      |                |                |     |

**Important:**
- **ID**: Unique number for each party (1, 2, 3, etc.)
- **Guest Name**: The primary contact person's name (this is what they'll search for)
- **Party Members**: List ALL people in their party, including the primary guest
- Add more columns if needed for larger parties

**Tips:**
- If you have a Google Sheet with your guest list, you can copy/paste it
- Make sure each party has a unique ID
- The guest name is what they'll type to search, so use their full name
- You can add as many party member columns as needed

---

### **Step 5: Deploy the Script as a Web App**

1. In the Script editor, click **Deploy** > **New deployment**
2. Click the ⚙️ gear icon next to "Select type"
3. Choose **Web app**
4. Fill in the settings:
   - **Description**: "Wedding RSVP v1"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account and grant permissions
8. **IMPORTANT:** Copy the **Web app URL** that appears
   - It looks like: `https://script.google.com/macros/s/AKfycbz.../exec`
   - Save this URL - you'll need it next!

---

### **Step 6: Connect Your Website to Google Sheets**

1. Open **`assets/js/main.js`** in your project
2. Find this line near the top (around line 95):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_GOOGLE_SCRIPT_URL_HERE` with your Web App URL from Step 5
4. **Save the file**

Example:
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz1234567890abcdef/exec';
```

---

### **Step 7: Test Your RSVP Form**

1. Open your `index.html` file in a browser (or upload to GitHub Pages)
2. Scroll to the RSVP section
3. Start typing one of your guest names in the search box
4. You should see matching names appear in a dropdown
5. Select a name
6. You should see the party members with checkboxes
7. Check/uncheck who's attending
8. Add an optional message
9. Click **Send RSVP**
10. Check your Google Sheet - a new "Responses" sheet should appear with the submission!

---

## 📊 Viewing Your Responses

All RSVPs will be saved in the **"Responses"** sheet with these columns:

- **Timestamp**: When they submitted
- **Guest ID**: The party ID
- **Guest Name**: Who submitted
- **Total in Party**: How many people in their party
- **Attending Count**: How many are attending
- **Attending Members**: Names of who's coming
- **Not Attending Members**: Names of who can't make it
- **Message**: Their optional message

The responses are automatically sorted with the newest first!

---

## 🚀 Deploy to GitHub Pages

Once everything is working:

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add custom RSVP system with Google Sheets"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** > **Pages**
   - Under "Source", select **main** branch
   - Click **Save**
   - Your site will be live at `https://yourusername.github.io/anewrivera`

---

## 🔧 Troubleshooting

### **"No guests found" when searching**

1. Make sure your Google Sheet has the "GuestList" sheet
2. Check that your SHEET_ID is correct in the Apps Script
3. Make sure you deployed the script as a Web App
4. Check the browser console (F12) for errors

### **Form says "Error submitting" after clicking Send**

1. Make sure your GOOGLE_SCRIPT_URL is correct in `main.js`
2. Check that the script is deployed with "Who has access" set to "Anyone"
3. Look at the script execution logs: Script editor > Executions

### **Guest dropdown doesn't appear**

1. Open browser console (F12)
2. Check for JavaScript errors
3. Make sure the script URL is correct

### **Testing Locally**

The form will work with sample data even without Google Sheets set up. The JavaScript includes fallback sample data for testing.

---

## 🎨 Customization

### **Change Colors**

Edit `assets/css/styles.css` - look for these color variables at the top:
```css
--accent: #c87a57;  /* Main accent color */
```

### **Add More Party Member Columns**

Just add more columns to your Google Sheet. The script automatically reads all columns after column 2.

### **Change Sheet Names**

In `google-apps-script.js`, update these constants:
```javascript
const GUEST_LIST_SHEET = 'GuestList';
const RESPONSES_SHEET = 'Responses';
```

---

## 📞 Need Help?

If you run into issues:

1. Check the browser console for errors (F12 > Console)
2. Check the Apps Script logs (Script editor > Executions)
3. Make sure all IDs and URLs are correct
4. Try the sample data first before using your real guest list

---

## 🎉 You're Done!

Your wedding website now has a fully functional RSVP system that:
- Lets guests search for their name
- Shows their party members
- Doesn't require email addresses
- Saves everything to Google Sheets
- Works on your static GitHub Pages site
- Is completely free!

**Happy planning! 💕**


