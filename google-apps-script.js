/**
 * WEDDING RSVP - GOOGLE APPS SCRIPT
 * 
 * This script connects your wedding website to Google Sheets.
 * It handles guest list retrieval and RSVP submissions.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet with two sheets: "GuestList" and "Responses"
 * 2. Open Tools > Script editor
 * 3. Delete any existing code and paste this entire file
 * 4. Update the SHEET_ID constant below with your Google Sheet ID
 * 5. Save the script (File > Save)
 * 6. Deploy as Web App (Deploy > New deployment > Web app)
 * 7. Set "Execute as" to "Me"
 * 8. Set "Who has access" to "Anyone"
 * 9. Click "Deploy" and copy the Web App URL
 * 10. Paste that URL into your website's main.js file (GOOGLE_SCRIPT_URL constant)
 */

// ============================================
// CONFIGURATION
// ============================================

// Get your Sheet ID from the URL:
// https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
const SHEET_ID = 'YOUR_SHEET_ID_HERE';

// Sheet names (you can change these if you rename your sheets)
const GUEST_LIST_SHEET = 'GuestList';
const RESPONSES_SHEET = 'Responses';

// ============================================
// MAIN HANDLERS
// ============================================

/**
 * Handle GET requests (fetch guest list)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'getGuests') {
      const guests = getGuestList();
      return ContentService
        .createTextOutput(JSON.stringify(guests))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Invalid action' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle POST requests (RSVP submissions)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    saveRSVP(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// GUEST LIST FUNCTIONS
// ============================================

/**
 * Fetch and format guest list from spreadsheet
 */
function getGuestList() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(GUEST_LIST_SHEET);
  
  if (!sheet) {
    throw new Error('Guest list sheet not found. Make sure you have a sheet named "' + GUEST_LIST_SHEET + '"');
  }
  
  const data = sheet.getDataRange().getValues();
  
  // Skip header row
  const guests = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Skip empty rows
    if (!row[0]) continue;
    
    // Expected columns: ID | Guest Name | Party Member 1 | Party Member 2 | Party Member 3 | ...
    const guestId = row[0];
    const guestName = row[1];
    
    // Collect all party members (starting from column 2)
    const partyMembers = [];
    for (let j = 2; j < row.length; j++) {
      if (row[j]) {
        partyMembers.push(row[j].toString().trim());
      }
    }
    
    // If no party members listed, use the guest name
    if (partyMembers.length === 0) {
      partyMembers.push(guestName);
    }
    
    guests.push({
      id: guestId,
      name: guestName,
      party: partyMembers
    });
  }
  
  return guests;
}

// ============================================
// RSVP SUBMISSION FUNCTIONS
// ============================================

/**
 * Save RSVP response to spreadsheet
 */
function saveRSVP(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(RESPONSES_SHEET);
  
  // Create Responses sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(RESPONSES_SHEET);
    // Add header row
    sheet.appendRow([
      'Timestamp',
      'Guest ID',
      'Guest Name',
      'Total in Party',
      'Attending Count',
      'Attending Members',
      'Not Attending Members',
      'Message'
    ]);
  }
  
  // Format the data
  const timestamp = new Date(data.timestamp);
  const attendingMembers = data.attendingMembers.join(', ');
  const notAttendingMembers = data.notAttendingMembers.join(', ');
  
  // Append the new response
  sheet.appendRow([
    timestamp,
    data.guestId,
    data.guestName,
    data.totalInParty,
    data.attendingCount,
    attendingMembers,
    notAttendingMembers || 'N/A',
    data.message || 'N/A'
  ]);
  
  // Auto-resize columns for better readability
  sheet.autoResizeColumns(1, 8);
  
  // Sort by timestamp (most recent first)
  const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, 8);
  range.sort({column: 1, ascending: false});
  
  Logger.log('RSVP saved for: ' + data.guestName);
}

// ============================================
// SETUP HELPER FUNCTION
// ============================================

/**
 * Run this function once to create a sample guest list
 * Instructions:
 * 1. Click the play button next to this function name
 * 2. Grant permissions when asked
 * 3. Check your spreadsheet - it should have sample data
 */
function createSampleGuestList() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(GUEST_LIST_SHEET);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(GUEST_LIST_SHEET);
  } else {
    sheet.clear();
  }
  
  // Add header and sample data
  const sampleData = [
    ['ID', 'Guest Name', 'Party Member 1', 'Party Member 2', 'Party Member 3'],
    [1, 'John Smith', 'John Smith', 'Jane Smith', 'Tommy Smith'],
    [2, 'Maria Garcia', 'Maria Garcia', 'Carlos Garcia', ''],
    [3, 'David Lee', 'David Lee', '', ''],
    [4, 'The Johnson Family', 'Mike Johnson', 'Sarah Johnson', 'Emily Johnson'],
    [5, 'Robert Brown', 'Robert Brown', 'Lisa Brown', '']
  ];
  
  sheet.getRange(1, 1, sampleData.length, sampleData[0].length).setValues(sampleData);
  
  // Format header
  sheet.getRange(1, 1, 1, sampleData[0].length)
    .setFontWeight('bold')
    .setBackground('#c87a57')
    .setFontColor('#ffffff');
  
  sheet.autoResizeColumns(1, sampleData[0].length);
  
  Logger.log('Sample guest list created!');
  SpreadsheetApp.getUi().alert('Sample guest list created! Replace this data with your actual guests.');
}


