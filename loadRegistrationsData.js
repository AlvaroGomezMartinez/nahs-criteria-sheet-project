/**
 * Returns a map of student IDs using the data from "Form Responses 2" in the
 * "Registrations SY 24.25" Google sheet.
 * 
 * Note: When a student re-enrolls, at NAHS, the map's entry for that student
 * ID will contain an array with multiple elements, each representing their
 * subsequent placement at NAHS.
 *
 * @file loadRegistrationsData.js
 * @return {Map<number, Array<Object>>} A map of student IDs with the values from "Form Responses 2".
 */
function loadRegistrationsData() {
  const Form_Responses_2 = SpreadsheetApp.openById(
    "1kAWRpWO4xDtRShLB5YtTtWxTbVg800fuU2RvAlYhrfA",
  )
    .getSheetByName("Form Responses 2")
    .getDataRange()
    .getValues();

  const registrationsMap = new Map();

  const headers = Form_Responses_2[0];

  for (let i = 1; i < Form_Responses_2.length; i++) {
    const row = Form_Responses_2[i];
    const rowData = {};

    headers.forEach((header, index) => {
      // rowData[header] = row[index]; This is the original statement before debugging. Uncomment this and delete the debugging attempt if the fix doesn't work.
      let value = row[index];
      if (header === "Placement Days") {
        if (typeof value === "string") {
        value = extractInteger(value);
        }
      }
      rowData[header] = value;
    });

    let studentId = row[3]; // The student ID is in the fourth column (index 3)
    if (studentId) {
      studentId = String(studentId).trim();
      if (registrationsMap.has(studentId)) {
        registrationsMap.get(studentId).push(rowData);
      } else {
        registrationsMap.set(studentId, [rowData]);
      }
    } else {
      Logger.log(`Registrations SY 24.25: Empty student ID at row ${i + 1}`);
    }
  }

  // Logger.log(`Total entries in map: ${registrationsMap.size}`);
  return registrationsMap;
}

function extractInteger(value) {
  if (typeof value === "string") {
    const match = value.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  } else if (typeof value === "number") {
    return value;
  } else {
    return null;
  }
}
