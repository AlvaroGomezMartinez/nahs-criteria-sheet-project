/**
 * This is a helper function that unmerges all of the merged cells in column A
 * of the "Active" sheet and fills the unmerged cells with the value of the top
 * cell in the merged range.
 * 
 * @file unmergeColumnA.js
 * @return {void}
 */
function unmergeAndFillColumnA() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active");
  const range = sheet.getRange("A2:A" + sheet.getLastRow()); // Adjust range to exclude header
  const mergedRanges = range.getMergedRanges();

  mergedRanges.forEach((mergedRange) => {
    const topCellValue = mergedRange.getCell(1, 1).getValue();
    mergedRange.breakApart();
    mergedRange.setValue(topCellValue);
  });
}
