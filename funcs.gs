
/**
 * This function loads the data that the clerk enters into the sidebar of the Google Sheets UI.
 * 
 * @param {*} rowData
 * @return {*} 
 */
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
    rowData.program,
    rowData.specPops,
    rowData.behContract,
    rowData.notes
  ]);
  return true;
} else {
  console.log("rowData is undefined");
}
}