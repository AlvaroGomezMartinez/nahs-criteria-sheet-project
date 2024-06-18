function addNewRow(rowData) {
  if (rowData !== undefined) {
  const currentDate = new Date();

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
} else {
  console.log("rowData is undefined");
}
}