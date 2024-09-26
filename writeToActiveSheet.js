/**
 * Writes the data from updatedUpdatedUpdatedActiveStudentDataMap to the "Active" sheet.
 */
function writeToActiveSheet(updatedUpdatedUpdatedActiveStudentDataMap) {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active");

  // Clear existing data from Row 2 downwards
  const lastRow = activeSheet.getLastRow();
  if (lastRow > 1) {
    activeSheet
      .getRange(2, 1, lastRow - 1, activeSheet.getLastColumn())
      .clear();
  }

  // Prepare the data in the desired order
  const outputData = [];

  updatedUpdatedUpdatedActiveStudentDataMap.forEach((studentData, studentId) => {
    // Extract the needed data fields in the specified order
    outputData.push([
      studentData.entryData ? studentData.entryData[0]["Student Name"] : null, // Name
      studentData.registration ? studentData.registration[0]["Home Campus"] : null, // Home Campus
      studentData.entryData ? studentData.entryData[0]["Grade"] : null, // Grade
      studentId, // Student ID
      studentData.registration ? studentData.registration[0]["Placement Offense"] : null, // Offense
      studentData.entryData ? studentData.entryData[0]["Entry Date"] : null, // Start Date
      studentData.registration ? studentData.registration[0]["Placement Days"] : null, // Placement Days
      studentData.attendance ? studentData.attendance[0][4] : null, // Days in Att
      studentData.attendance ? studentData.attendance[0][5] : null, // Days in Enrl
      null, // Estimated Days Left
      studentData.withdrawnData ? studentData.withdrawnData[0]["Review Date"] : null, // Review Date
      null, // Estimated Exit Day
      null, // Recidivist
      studentData.registration ? studentData.registration[0]["Eligibilty"] : null, // Eligibility
      studentData.registration ? studentData.registration[0]["Educational Factors"] : null, // Educational Factors
      studentData.registration ? studentData.registration[0]["Behavior Contract"] : null, // Behavior Contract
    ]);
  });

  // Write the prepared data to the "Active" sheet starting from Row 2
  if (outputData.length > 0) {
    activeSheet
      .getRange(2, 1, outputData.length, outputData[0].length)
      .setValues(outputData);
  }
}
