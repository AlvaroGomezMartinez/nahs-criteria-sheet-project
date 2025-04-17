/**
 * Creates a map of student attendance data using the data from the "Alt_HS_Attendance_Enrollment_Count" sheet
 * found in the NAHS Criteria Sheet.
 *
 * @file loadStudentAttendanceData.js
 * @return {Map<number, Object>} A map where the key is the student id and the value contains the student's name, days in attendance, and days in enrollment.
 */
function loadStudentAttendanceData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "Alt_HS_Attendance_Enrollment_Count",
  );
  const dataRange = sheet.getDataRange();
  const dataValues = dataRange.getValues();

  const studentAttendanceDataMap = new Map(); // Map object

  const headers = dataValues[0];

  for (let i = 1; i < dataValues.length; i++) {
    const rowData = dataValues[i];
    let studentID = rowData[2];

    headers.forEach((header, index) => {
      rowData[header] = rowData[index];
    });

    if (studentID) {
      studentID = String(studentID).trim(); // Convert to string and trim spaces
      studentAttendanceDataMap.set(studentID, [rowData]);
    } else {
      Logger.log(`Alt_HS_Attendance_Enrollment_Count: Empty student ID at row ${i + 1}`);
    }
  }

//   Logger.log(
//     `Total entries in attendance map: ${studentAttendanceDataMap.size}`,
//   );
  return studentAttendanceDataMap;
}
