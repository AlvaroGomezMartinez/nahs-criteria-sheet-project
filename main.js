/**
 * @author Alvaro Gomez[alvaro.gomez@nisd.net], Academic Technology Coach
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
  const activeStudents = loadActiveStudentsData();
  const registrations = loadRegistrationsData();
  const attendanceData = loadStudentAttendanceData();
  const entryWithdrawalData = loadEntryWithdrawalData();

  unmergeAndFillColumnA();

  // Map to store the merged result
  const result = new Map();

  // First left join with registrations
  activeStudents.forEach((studentData, studentId) => {
    // Get registration data for the current student or null if not found
    const registrationData = registrations.get(studentId) || null;
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
