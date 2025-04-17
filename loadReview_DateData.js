/**
 * Creates a map of review data data using the data from the "Review_Date" sheet
 * found in the NAHS Criteria Sheet spreadsheet.
 *
 * @file loadReviewDateData.js
 * @return {Map<number, Object>} A map where the key is the student id and the value contains the student's name and review date.
 */
function loadReviewDateData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Review_Date");
  const dataRange = sheet.getDataRange();
  const dataValues = dataRange.getValues();

  const reviewDateDataMap = new Map(); // Map object

  const headers = dataValues[0];

  for (let i = 1; i < dataValues.length; i++) {
    const rowData = dataValues[i];
    let studentID = rowData[1];

    // Construct an object with only named properties
    const rowObject = {};
    headers.forEach((header, index) => {
      rowObject[header] = rowData[index];
    });

    if (studentID) {
      studentID = String(studentID).trim(); // Convert to string and trim spaces
      reviewDateDataMap.set(studentID, [rowObject]);
    } else {
      Logger.log(`Review_Date: Empty student ID at row ${i + 1}`);
    }
  }

  //   Logger.log(
  //     `Total entries in review date map: ${reviewDateDataMap.size}`,
  //   );
  return reviewDateDataMap;
}
