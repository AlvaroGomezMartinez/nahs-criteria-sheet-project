/** Add a trigger so the onEdit function runs when the "Active" sheet is edited.
 * @todo Go to Triggers.
 * @todo Click on + Add Trigger.
 * @todo Choose onEdit from the function dropdown.
 * @todo Set the event type to "On edit".
 * @todo Save the trigger.
*/

// function onEdit(e) {
//     var sheet = e.source.getActiveSheet();
//     if (sheet.getName() === "Active") {
//         var range = e.range;
//         if (range.getLastRow() > sheet.getLastRow() - 1) {
//             pushRowsToCounselorSheet();
//         }
//     }
// }

/**
 * This function pushes the data from the "Active" sheet to each counselor's caseload sheet.
 */
function pushRowsToCounselorSheet() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var wsActive = ss.getSheetByName("Active");
    var wsHensley = ss.getSheetByName("Hensley");
    var wsRodriguez = ss.getSheetByName("Rodriguez");
    var values = wsActive.getRange(2, 1, wsActive.getLastRow() - 1, wsActive.getLastColumn()).getValues();
    var hensleyCaseLoad = [];
    var rodriguezCaseLoad = [];

    for (let i = 0; i < values.length; i++) {
        let currentValue = values[i][0];
        if (currentValue === "" && i > 0) {
            currentValue = values[i - 1][0];
            values[i][0] = currentValue; // Adds the value from the cell above to cells that are merged.
        }
        if (currentValue.charAt(0) <= "K") {
            hensleyCaseLoad.push(values[i]);
        } else {
            rodriguezCaseLoad.push(values[i]);
        }
    }

    wsHensley.getRange(2, 1, hensleyCaseLoad.length, hensleyCaseLoad[0].length).setValues(hensleyCaseLoad);
    wsRodriguez.getRange(2, 1, rodriguezCaseLoad.length, rodriguezCaseLoad[0].length).setValues(rodriguezCaseLoad);
}

const ss = SpreadsheetApp.getActiveSpreadsheet();
const ws = ss.getSheetByName("Active");
const wsHensley = ss.getSheetByName("Hensley");
const wsRodriguez = ss.getSheetByName("Rodriguez");
const lastRow = ws.getLastRow();
const lastColumn = ws.getLastColumn();
const range = ws.getRange(2, 1, lastRow - 1, lastColumn);
const values = range.getValues();
const hensleyCaseLoad = [];
const rodriguezCaseLoad = [];

/** This for loop creates each counselor's case load.
 * Check the value of index 0 in each array inside the "values" array.
 * If the value is blank, it will use the value in the cell above it; this is a fix for merged cells.
 * If the value of the first letter is A-K, push the array to the hensleyCaseload array.
 * If the value of the first letter is L-Z, push the array to the rodriguezCaseload array.
*/
for (let i = 0; i < values.length; i++) {
    let currentValue = values[i][0];
    if (currentValue === "" && i > 0) {
        currentValue = values[i - 1][0];
        values[i][0] = currentValue;
    }
    if (currentValue.charAt(0) <= "K") {
        hensleyCaseLoad.push(values[i]);
    } else {
        rodriguezCaseLoad.push(values[i]);
    }
}
  
/** Go to wsHensley and check the values of each row in the range D2:D against the values in the hensleyCaseLoad array. If the values are different, append the new values to the bottom of the sheet.
*/
if (lastRow > 1) {
  const wsHensleyRange = wsHensley.getRange(
    2,
    4,
    wsHensley.getLastRow() - 1,
    1
  );
  const wsHensleyValues = wsHensleyRange.getValues().flat();
  let hensleyValuesChanged = false;

  for (let i = 0; i < hensleyCaseLoad.length; i++) {
    if (!wsHensleyValues.includes(Number(hensleyCaseLoad[i][3]))) {
      wsHensley.appendRow(hensleyCaseLoad[i]);
      hensleyValuesChanged = true;
    }
  }
} else { Logger.log("No data in Hensley sheet."); }

const wsRodriguezRange = wsRodriguez.getRange(2, 4, wsRodriguez.getLastRow() - 1, 1);
const wsRodriguezValues = wsRodriguezRange.getValues().flat();
let rodriguezValuesChanged = false;

for (let i = 0; i < rodriguezCaseLoad.length; i++) {
    if (!wsRodriguezValues.includes(Number(rodriguezCaseLoad[i][3]))) {
        wsRodriguez.appendRow(rodriguezCaseLoad[i]);
        rodriguezValuesChanged = true;
    }
}