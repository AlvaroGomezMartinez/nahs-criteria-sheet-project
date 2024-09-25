/**
 * Loads the list of active students from the "Active" sheet.
 *
 * @file loadActiveStudentsData.js
 * @return {Map<number, Object>} A map where the key is the student id and the value is an object representing the row data.
 */
function loadActiveStudentsData() {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("Active")
    .getDataRange()
    .getValues();

  const activeStudentDataMap = new Map();

  const headers = activeSheet[0];

  for (let i = 1; i < activeSheet.length; i++) {
    const row = activeSheet[i];
    const rowData = {};

    headers.forEach((header, index) => {
      rowData[header] = row[index];
    });

    let studentId = row[3];
    if (studentId) {
      studentId = String(studentId).trim();
      if (activeStudentDataMap.has(studentId)) {
        activeStudentDataMap.get(studentId).push(rowData);
      } else {
        activeStudentDataMap.set(studentId, [rowData]);
      }
    }
  }

  //   Logger.log(`Total entries in the Active Student Data Map: ${activeStudentDataMap.size}`);
  return activeStudentDataMap;
}
