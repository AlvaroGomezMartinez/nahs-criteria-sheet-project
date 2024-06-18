function loadForm() {
  
  const htmlForSidebar = HtmlService.createTemplateFromFile("uform");
  const htmlOutput = htmlForSidebar.evaluate().setTitle("NAHS Student Entry Form");

  const ui = SpreadsheetApp.getUi();
  ui.showSidebar(htmlOutput);

}

function createMenu() {

  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu("🚩Add a Student");
  menu.addItem("Open Student Entry Form", "loadForm");
  menu.addToUi();

}

f