/**
 * Unit Tests for NAHS_EXPECTED_WITHDRAW_DATE function
 * 
 */
var QUnit = QUnitGS2.QUnit;

function doGet() {
  QUnitGS2.init(); // Initialize QUnitGS2

  test_NAHS_EXPECTED_WITHDRAW_DATE(); // Call the test function

  QUnit.start(); // Start running tests
  return QUnitGS2.getHtml(); // Display the results
}

// Define the test function outside of doGet()
function test_NAHS_EXPECTED_WITHDRAW_DATE() {
  QUnit.module("Unit Tests");

  // Basic test with no weekends, holidays, or additional days
  QUnit.test("Basic Case", function(assert) {
    const startDate = new Date("2024-11-18"); // Wednesday
    const numberOfDays = 5;
    const holidays = holidayDates;
    const additionalDays = [0, 0];
    const result = NAHS_EXPECTED_WITHDRAW_DATE(startDate, numberOfDays, holidays, additionalDays);
    assert.equal(result.toISOString().slice(0, 10), "2024-11-22", "Expected withdrawal date after 5 school days.");
  });

  // Test to check if holidays are skipped correctly
  QUnit.test("Holiday Case", function(assert) {
    const startDate = new Date("2024-11-05"); // Monday
    const numberOfDays = 30;
    const holidays = holidayDates; // Tuesday (11/5) is a holiday
    const additionalDays = [0, 0];
    const result = NAHS_EXPECTED_WITHDRAW_DATE(startDate, numberOfDays, holidays, additionalDays);
    assert.equal(result.toISOString().slice(0, 10), "2025-01-07", "Expected withdrawal date with holiday on 2024-11-05.");
  });

  // Test to check if weekends are skipped
  QUnit.test("Weekend Case", function(assert) {
    const startDate = new Date("2024-11-14"); // Thursday
    const numberOfDays = 5;
    const holidays = holidayDates;
    const additionalDays = [0, 0];
    const result = NAHS_EXPECTED_WITHDRAW_DATE(startDate, numberOfDays, holidays, additionalDays);
    assert.equal(result.toISOString().slice(0, 10), "2024-11-20", "Expected withdrawal date skipping weekend.");
  });

  // Test to verify additional days are correctly added or subtracted
  QUnit.test("Additional Days Case", function(assert) {
    const startDate = new Date("2024-11-11"); // Monday
    const numberOfDays = 5;
    const holidays = holidayDates;
    const additionalDays = [1, 2]; // Adds 1 additional day
    const result = NAHS_EXPECTED_WITHDRAW_DATE(startDate, numberOfDays, holidays, additionalDays);
    assert.equal(result.toISOString().slice(0, 10), "2024-11-18", "Expected withdrawal date with additional day.");
  });

  // Test for a long range of holidays
  QUnit.test("Long Holiday Case", function(assert) {
    const startDate = new Date("2024-11-22"); // Friday before a long holiday
    const numberOfDays = 5;
    const holidays = holidayDates;
    const additionalDays = [0, 0];
    const result = NAHS_EXPECTED_WITHDRAW_DATE(startDate, numberOfDays, holidays, additionalDays);
    assert.equal(result.toISOString().slice(0, 10), "2024-12-05", "Expected withdrawal date after a long holiday.");
  });

  // Test for invalid inputs
  QUnit.test("Invalid Input Case", function(assert) {
    const startDate = null;
    const numberOfDays = 5;
    const holidays = holidayDates;
    const additionalDays = [0, 0];
    const result = NAHS_EXPECTED_WITHDRAW_DATE(startDate, numberOfDays, holidays, additionalDays);
    assert.equal(result, null, "Expected null return for invalid start date.");
  });
}

function getResultsFromServer() {
  return QUnitGS2.getResultsFromServer();
}



