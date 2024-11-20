/**
 * Retrieves the array of NISD holiday dates from the NISDHolidayLibrary.
 * The array of NISD holiday dates is used to exclude non-school days from calculations
 * for determining the expected student exit date from DAEP.
 * 
 * Each date in the array is formatted as 'MM/DD/YYYY' and represents a school holiday or break
 * during which no classes are held.
 * 
 * @constant {string[]} holidayDates - An array of strings, where each string is a holiday date.
 */
const holidayDates = (function () {
  const library = NISDHolidayLibrary.NISDHolidayLibrary(); // Use the correct alias
  return library.getHolidayDates(); // Call getHolidayDates to retrieve the dates
})();

function testHolidayDates() {
  console.log(holidayDates); // Logs the array of holiday dates to the console
}
