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

  // Map to store the first merged result
  const leftoverActiveStudentDataMap = new Map();

  // First join. This is an inner join between activeStudentsData and entryWithdrawalData.
  // The result is a map of students who were already in the "Active" sheet and were also
  // active in the entryWithdrawalData map.
  activeStudentsData.forEach((studentDataArray, studentId) => {
    if (entryWithdrawalData.has(studentId)) {
      const entryWithdrawalArray = entryWithdrawalData.get(studentId);
      // Check if the "Withdrawal Code" value is an empty string
      if (entryWithdrawalArray[0]["Withdrawal Code"] === "") {
        leftoverActiveStudentDataMap.set(studentId, {
          ...studentDataArray,
          entryWithdrawal: entryWithdrawalArray,
        });
      }
    }
    return leftoverActiveStudentDataMap;
  });

  // Perform a left join with activeStudentsData and entryWithdrawalData.
  // The result is a map of students who are not in the entryWithdrawalData map,
  // meaning that it pulls out students withdrawn from NAHS.
  const withdrawnOuterJoinMap = new Map();

  activeStudentsData.forEach((studentDataArray, studentId) => {
    if (!entryWithdrawalData.has(studentId)) {
      withdrawnOuterJoinMap.set(studentId, studentDataArray);
    }
    return withdrawnOuterJoinMap;
  });

  // Clear data in "Withdrawn"
  const withdrawnSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Withdrawn");
  const lastRow = withdrawnSheet.getLastRow(); // Find the last row with data
  const lastColumn = withdrawnSheet.getLastColumn(); // Find the last column with data
  withdrawnSheet.getRange(2, 1, lastRow - 1, lastColumn).clear(); // Clear from row 2 down

  // Add the updated data to "Withdrawn"
  withdrawnOuterJoinMap.forEach((studentDataArray, studentId) => {
    studentDataArray.forEach((studentData) => {
      withdrawnSheet.appendRow(Object.values(studentData));
    });
  });

  // Perform a right join between the leftoverActiveStudentDataMap and entryWithdrawalData
  // The purpose of this join is to create a list of current active students and those who
  // recently enrolled at NAHS.
  const updatedActiveStudentDataMap = new Map();

  // Iterate through entryWithdrawalData (Table B)
  entryWithdrawalData.forEach((entryDataArray, studentId) => {
    let withdrawnData = null;

    // Loop through withdrawnStudentDataMap (Table A) and find the studentId in the array keys
    leftoverActiveStudentDataMap.forEach((dataArray, keyArray) => {
      // Check if studentId exists in the keyArray
      if (keyArray.includes(studentId)) {
        withdrawnData = dataArray; // Get the corresponding data for the student
      }
    });

    // Push the results to updatedActiveStudentDataMap
    updatedActiveStudentDataMap.set(studentId, {
      entryData: entryDataArray,
      withdrawnData: withdrawnData, // If found, otherwise it remains null
    });
  });

  // Perform a right join with updatedActiveStudentDataMap and registrationsData
  const updatedUpdatedActiveStudentDataMap = new Map();

  updatedActiveStudentDataMap.forEach((studentData, studentId) => {
    // Get registration data for the current student or null if not found
    const registrationData = registrationsData.get(studentId) || null;
    // Merge student data with registration data and store it in the updatedUpdatedActiveStudentDataMap map
    updatedUpdatedActiveStudentDataMap.set(studentId, {
      ...studentData,
      registration: registrationData,
    });
  });

  // Second left join with attendanceData
  const updatedUpdatedUpdatedActiveStudentDataMap = new Map();

  updatedUpdatedActiveStudentDataMap.forEach((studentData, studentId) => {
    // Normalize the student ID to a string (in case it's not already)
    const normalizedStudentId = String(studentId).trim();
    // Get attendance data using the normalized ID or null if not found
    const attendance = attendanceData.get(normalizedStudentId) || null;
    // Merge the existing student data with attendance data
    updatedUpdatedUpdatedActiveStudentDataMap.set(studentId, {
      ...studentData,
      attendance: attendance,
    });
  });



  // Write the merged result to the "Active" sheet
  writeToSheet(result);

  // Return the merged data map
  return result;
}
