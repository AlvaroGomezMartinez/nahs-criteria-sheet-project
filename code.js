criteriaSheet = {
    id: '1gaGyH312ad85wpyfH6dGbyNiS4NddqH6NvzTG6RPGPA',
    sheet: 'ACTIVE',
}

// Create
function createRow(data) {
  var ss = SpreadsheetApp.openById(criteriaSheet.id);
  var sheet = ss.getSheetByName(criteriaSheet.sheet);
  sheet.appendRow([data.name, data.age, data.email]);
}

// Read
function readRow(rowNumber) {
  var ss = SpreadsheetApp.openById(criteriaSheet.id);
  var sheet = ss.getSheetByName(criteriaSheet.sheet);
  var range = sheet.getRange(rowNumber, 1, 1, 3);
  var values = range.getValues();
  return {name: values[0][0], age: values[0][1], email: values[0][2]};
}

// Update
function updateRow(rowNumber, data) {
  var ss = SpreadsheetApp.openById(criteriaSheet.id);
  var sheet = ss.getSheetByName(criteriaSheet.sheet);
  var range = sheet.getRange(rowNumber, 1, 1, 3);
  range.setValues([[data.name, data.age, data.email]]);
}

// Delete
function deleteRow(rowNumber) {
  var ss = SpreadsheetApp.openById(criteriaSheet.id);
  var sheet = ss.getSheetByName(criteriaSheet.sheet);
  sheet.deleteRow(rowNumber);
}