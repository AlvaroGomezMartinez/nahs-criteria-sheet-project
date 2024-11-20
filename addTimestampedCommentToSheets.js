/**
 * Adds a timestamped comment to cell A1 of each specified sheet.
 * The comment includes the current date and time, formatted as "MM/dd/yy h:mm a",
 * and identifies the author as "AG".
 *
 * @function addTimestampedCommentToSheets
 * @throws Will throw an error if any specified sheet is missing.
 */
function addTimestampedCommentToSheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const user = getUserName();
  /**
   * Array of sheet names to which the timestamped comment will be added.
   * Modify the names here to match your spreadsheet.
   * @type {Array<string>}
   */
  const sheets = [
    spreadsheet.getSheetByName("Active"),
    spreadsheet.getSheetByName("Withdrawn"),
    spreadsheet.getSheetByName("Hensley"),
    spreadsheet.getSheetByName("Rodriguez"),
    spreadsheet.getSheetByName('Review_Date')
  ];

  // Get the current date and time, and format it as "MM/dd/yy h:mm a"
  const today = new Date();
  const formattedDateTime = Utilities.formatDate(today, Session.getScriptTimeZone(), "MM/dd/yy h:mm a");

  // Comment to add in cell A1 of each sheet
  const comment = `Last updated on ${formattedDateTime} by ${user}.`;

  /**
   * Loop through each sheet and add the comment to cell A1.
   * Checks if each sheet exists before attempting to add the comment.
   */
  sheets.forEach(sheet => {
    if (sheet) { // Only proceed if the sheet exists
      sheet.getRange("A1").setNote(comment);  // Add the comment as a note in cell A1
    } else {
      console.warn("A specified sheet was not found in the spreadsheet.");
    }
  });
}

function getUserName() {
  const user = Session.getActiveUser();
  return user ? user.getEmail() : "Unknown User"; // Returns email as a stand-in for name
}
