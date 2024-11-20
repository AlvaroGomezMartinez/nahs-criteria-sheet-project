/**
 * Writes the data from updatedUpdatedUpdatedActiveStudentDataMap to the "Active" sheet.
 */
function writeToActiveSheet(updatedUpdatedUpdatedUpdatedActiveStudentDataMap) {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active");

  // Ensure row 2 is cleared and contains the placeholder message
  const secondRow = activeSheet.getRange(2, 1, 1, activeSheet.getLastColumn());
  const expectedMessage = "Do not delete this row. Blank row is here on purpose, so the function that inserts the data works. This is a work around.";
  secondRow.clear(); // Clear all content and formatting in row 2
  activeSheet.getRange(2, 1).setValue(expectedMessage); // Restore the placeholder message
  console.log("Row 2 cleared and message restored.");

  // Delete existing data from Row 3 downwards
  const lastRow = activeSheet.getLastRow();
  if (lastRow > 2) { // Ensure there are rows to delete below row 2
    const numRowsToDelete = lastRow - 2; // Rows below row 2 to delete
    if (numRowsToDelete > 0) {
      activeSheet.deleteRows(3, numRowsToDelete); // Delete rows starting at row 3
      console.log(`Deleted ${numRowsToDelete} rows starting from row 3.`);
    }
  }

  // Prepare the data in the desired order
  const outputData = [];

  function formatDateToMMDDYYYY(date) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null; // Check for invalid date
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2); // Last two digits of the year
    return `${month}/${day}/${year}`;
  }

  function calculateExpectedWithdrawDate(studentData) {
    const formattedEntryDate = studentData.activeData ? studentData.activeData["Start Date"] : (studentData.registration ? studentData.registration["Start Date"] : null);
    const placementDays = studentData.registration ? studentData.registration["Placement Days"] : null;
    const daysInEnrl = studentData.attendance ? studentData.attendance["DAYS IN Enrl"] : null;
    const daysInAtt = studentData.attendance ? studentData.attendance["DAYS IN ATT"] : null;

    if (!formattedEntryDate || isNaN(new Date(formattedEntryDate).getTime())) {
      return null;
    }

    if (!placementDays || !daysInEnrl || !daysInAtt) {
      return null;
    }

    const entryDateString = formatDateToMMDDYYYY(formattedEntryDate);
    const additionalDays = [daysInAtt, daysInEnrl];
    return NAHS_EXPECTED_WITHDRAW_DATE(entryDateString, placementDays, holidayDates, additionalDays);
  }

  updatedUpdatedUpdatedUpdatedActiveStudentDataMap.forEach((studentDataArray, studentId) => {
    // Access the relevant object within the array
    const studentData = studentDataArray; // Assume we want the first object in the array for each studentId

    // Extract data from each relevant section
    const entryData = studentData.activeData ? studentData.activeData["Start Date"] : (studentData.registration ? studentData.registration["Start Date"] : null);
    const registrationData = studentData.registration ? studentData.registration["Placement Days"] : null;
    const attendanceData = studentData.attendance ? studentData.attendance["DAYS IN ATT"] : null;
    const reviewDate = studentData.activeData ? studentData.activeData["Review Date"] : (studentData.withdrawnData ? studentData.withdrawnData["Review Date"] : null);

    // Ensure entryData is defined
    // if (!entryData) {
    //   console.error("Entry data is missing for Student ID:", studentId);
    //   return; // Skip this student if entry data is not available
    // }

    const formattedEntryDate = entryData ? formatDateToMMDDYY(new Date(entryData)) : null;
    const gradeString = studentData.activeData ? studentData.activeData["Grade"] : (studentData.registration ? studentData.registration["Grade"] : null);
    const estimatedExitDay = calculateExpectedWithdrawDate(studentData);

    const placementDays = studentData.registration ? studentData.registration["Placement Days"] : null;
    const daysInAttendance = studentData.attendance ? studentData.attendance["DAYS IN ATT"] : null;
    const estimatedDaysLeft = placementDays !== null && daysInAttendance !== null ? placementDays - daysInAttendance : null;

    outputData.push([
      studentData.activeData
        ? studentData.activeData["Name"]
        : (studentData.attendance ? studentData.attendance["STUDENT"] : null), // Name
      studentData.activeData
        ? studentData.activeData["Home Campus"]
        : (studentData.registration ? studentData.registration["Home Campus"] : null), // Home Campus
      gradeString, // Grade
      studentId, // Student ID
      studentData.activeData
        ? studentData.activeData["Offense"]
        : (studentData.registration ? studentData.registration["Placement Offense"] : null), // Offense
      formattedEntryDate, // Start Date
      studentData.activeData
        ? studentData.activeData["Placement Days"]
        : (studentData.registration ? studentData.registration["Placement Days"] : null), // Placement Days
      studentData.activeData
        ? studentData.activeData["Days In Att"]
        : (studentData.attendance ? studentData.attendance["DAYS IN ATT"] : null), // Days in Att
      studentData.activeData
        ? studentData.activeData["Days In Enrl"]
        : (studentData.attendance ? studentData.attendance["DAYS IN Enrl"] : null), // Days in Enrl
      estimatedDaysLeft, // Estimated Days Left
      reviewDate
        ? formatDateToMMDDYY(new Date(reviewDate))
        : null, // Review Date
      estimatedExitDay
        ? formatDateToMMDDYY(new Date(estimatedExitDay))
        : null, // Estimated Exit Day
      studentData.withdrawnData
        ? studentData.withdrawnData[0]["recidivist"]
        : (studentData.activeData ? studentData.activeData["Recidivist"] : null), // Recidivist
      studentData.activeData
        ? studentData.activeData["Eligibility"]
        : (studentData.registration ? studentData.registration["Eligibilty"] : null), // Eligibility, note that "Eligibty" is misspelled in studentData.registration, that's because it's misspelled in Irma's sheet, so this makes it match. Remember this for debugging.
      studentData.activeData
        ? studentData.activeData["Educational Factors"]
        : (studentData.registration ? studentData.registration["Educational Factors"] : null), // Educational Factors
      studentData.activeData
        ? studentData.activeData["Behavior Contract"]
        : (studentData.registration ? studentData.registration["Behavior Contract"] : null), // Behavior Contract
    ]);
  });

  if (outputData.length > 0) {
  // Sort outputData alphabetically by the first column (column A)
  outputData.sort((a, b) => {
    const nameA = a[0] ? a[0].toString().toLowerCase() : ""; // Convert to lowercase for case-insensitive sorting
    const nameB = b[0] ? b[0].toString().toLowerCase() : ""; 
    return nameA.localeCompare(nameB); // Sort alphabetically
  });

  // Write the sorted data to the "Active" sheet starting from row 2
  activeSheet
    .getRange(3, 1, outputData.length, outputData[0].length)
    .setValues(outputData);
}

}

// Helper function to format date objects to MM/DD/YY
function formatDateToMMDDYY(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return null; // Return null if date is invalid
  }

  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2); // Last two digits of the year
  return `${month}/${day}/${year}`;
}


