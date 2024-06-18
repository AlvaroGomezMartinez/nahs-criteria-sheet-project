function addNewRow(rowData) {
  if (rowData !== undefined) {
  const currentDate = new Date().toLocaleString('en-US');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("Active");
  ws.appendRow([
    rowData.name,
    rowData.campus,
    rowData.grade,
    rowData.id,
    rowData.stuOffense,
    currentDate,
    rowData.numDaysAssigned,
    "",
    "",
    "",
    rowData.recidivist,
    rowData.progra