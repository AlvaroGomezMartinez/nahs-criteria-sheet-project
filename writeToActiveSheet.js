/**
 * Writes the data from updatedUpdatedUpdatedActiveStudentDataMap to the "Active" sheet.
 */
function writeToActiveSheet() {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active");
  
  // Clear existing data from Row 2 downwards
  const lastRow = activeSheet.getLastRow();
  if (lastRow > 1) {
    activeSheet.getRange(2, 1, lastRow - 1, activeSheet.getLastColumn()).clear();
  }

  // Prepare the data in the desired order
  const outputData = [];
  
  updatedUpdatedUpdatedActiveStudentDataMap.forEach((studentData, studentId) => {
    // Extract the needed data fields in the specified order
    outputData.push([
      // Name
      // Home Campus
      // Grade
      studentId, // Student ID
      // Offense
      // Start Date
      // Placement Days
      // Days in Att
      // Days in Enrl
      // Estimated Days Left
      // Review Date
      // Estimated Exit Day
      // Recidivist
      // Eligibility
      // Educational Factors
      // Behavior Contract
      studentData.entryData[0]["Some Field"], // Example field from entryData
      studentData.withdrawnData ? studentData.withdrawnData[0]["Another Field"] : null, // Example field from withdrawnData
      studentData.registration ? studentData.registration["Reg Field"] : null, // Example field from registration
      studentData.attendance ? studentData.attendance["Att Field"] : null, // Example field from attendance
    ]);
  });

  // Write the prepared data to the "Active" sheet starting from Row 2
  if (outputData.length > 0) {
    activeSheet.getRange(2, 1, outputData.length, outputData[0].length).setValues(outputData);
  }
}
