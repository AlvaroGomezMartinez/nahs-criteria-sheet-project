/**
 * This function loads the student entry form in the sidebar of the Google Sheets UI.
 */
function loadForm() {
  const htmlForSidebar = HtmlService.createTemplateFromFile("uform");
  const htmlOutput = htmlForSidebar
    .evaluate()
    .setTitle("NAHS Student Entry Form");

  const ui = SpreadsheetApp.getUi();
  ui.showSidebar(htmlOutput);
}

/**
 * This function creates a menu item in the Google Sheets UI that allows users to open the student entry form.
 */
function createMenu() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu("🚩Add a Student");
  menu.addItem("Open Student Entry Form", "loadForm");
  menu.addToUi();
}

function onOpen() {
  createMenu();
}