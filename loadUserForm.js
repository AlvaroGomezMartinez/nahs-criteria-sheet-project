/**
 * This function creates a menu item in the Google Sheets UI that allows users to open the student entry form.
 */
function createMenu() {

  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu("🚩Update Sheets");
  menu.addItem("Update Active & the Counselor sheets", "main");
  menu.addToUi();

}

function onOpen() {
  createMenu();
}