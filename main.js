/**
 * @author Alvaro Gomez<alvaro.gomez@nisd.net>, Academic Technology Coach
 * Office: 210-397-9408
 * Mobile: 210-363-1577
 *
 * @description The objective of this project is to create
 * a spreadsheet that provides information to NAHS Administrators
 * and counselors.
 *
 *
 */

/**
 * This is the main function of the project.
 *
 * @description This function loads active students' data, registrations data,
 *              attendance data, and entry/withdrawal data from their respective
 *              sources. It performs four joins to merge this information into
 *              a single data structure. The merged data is then written to the
 *              "Active" sheet in the bound spreadsheet.
 *
 * @returns {Map<string, object>} A Map where the keys are student IDs and
 *                                the values are objects containing student
 *                                data such as their registration, attendance,
 *                                days and past DAEP placement information.
 */
function main() {
  // Prepare the "Active" sheet for data loading and joining, by unmerging the cells in column A
  unmergeAndFillColumnA();

  // Load data for active students, registration, attendance, and enrollment
  const activeStudentsData = loadActiveStudentsData();
  const registrationsData = loadRegistrationsData();
  const attendanceData = loadStudentAttendanceData();
  const entryWithdrawalData = loadEntryWithdrawalData();

  // Map to store the merged result
  const result = new Map();

  // First join. This is an inner join between activeStudents and entryWithdrawalData
  activeStudentsData.forEach((studentDataArray, studentId) => {
    if (entryWithdrawalData.has(studentId)) {
      const entryWithdrawalArray = entryWithdrawalData.get(studentId);
      // Check if the "Withdrawal Code" value is an empty string
      if (entryWithdrawalArray[0]["Withdrawal Code"] === "") {
        result.set(studentId, {
          ...studentDataArray,
          entryWithdrawal: entryWithdrawalArray,
        });
      }
    }
    return result;
  });

  // Perform a left join with the withdrawn students
  const withdrawnOuterJoinMap = new Map();
  activeStudentsData.forEach((studentDataArray, studentId) => {
    if (!entryWithdrawalData.has(studentId)) {
      withdrawnOuterJoinMap.set(studentId, studentDataArray);
    }
    return withdrawnOuterJoinMap;
  });

  // Clear and add to the data to the "Withdrawn" sheet
  const withdrawnSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Withdrawn");
  const lastRow = withdrawnSheet.getLastRow(); // Find the last row with data
  const lastColumn = withdrawnSheet.getLastColumn(); // Find the last column with data
  withdrawnSheet.getRange(2, 1, lastRow - 1, lastColumn).clear(); // Clear from row 2 down
  
  withdrawnOuterJoinMap.forEach((studentDataArray, studentId) => {
    studentDataArray.forEach((studentData) => {
        withdrawnSheet.appendRow(Object.values(studentData));
    });
  });

  // First left join with registrations
  activeStudentsData.forEach((studentData, studentId) => {
    // Get registration data for the current student or null if not found
    const registrationData = registrationsData.get(studentId) || null;
    // Merge student data with registration data and store it in the result map
    result.set(studentId, { ...studentData, registration: registrationData });
  });

  // Second left join with attendanceData
  result.forEach((studentData, studentId) => {
    // Normalize the student ID to a string (in case it's not already)
    const normalizedStudentId = String(studentId).trim();
    // Get attendance data using the normalized ID or null if not found
    const attendance = attendanceData.get(normalizedStudentId) || null;
    // Merge the existing student data with attendance data
    result.set(studentId, { ...studentData, attendance: attendance });
  });

  // Write the merged result to the "Active" sheet
  writeToSheet(result);

  // Return the merged data map
  return result;
}
