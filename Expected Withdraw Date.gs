/**
 * Calculates the expected withdrawal date by adding a specified number of school days to a given date,
 * excluding weekends and holidays.
 *
 * @param {Date} inputDateRange - The range of starting dates.
 * @param {number} numberOfDaysRange - The range of the number of school days to add to each starting date.
 * @param {Date[]} holidayRange - An array of holiday dates to skip.
 * @return {Array} - An array of resulting dates after adjusting school days.
 * @customfunction
 */
function EXPECTED_WITHDRAW_DATE(inputDateRange, numberOfDaysRange, holidayRange) {
  var output = [];

  for (var i = 0; i < inputDateRange.length; i++) {
    var inputDate = new Date(inputDateRange[i][0]);
    var numberOfDays = Number(numberOfDaysRange[i]);

    if (isNaN(inputDate) || isNaN(numberOfDays)) {
      output.push([null]);
    } else {

      var currentDate = new Date(inputDate);
      var count = 1; // Start count at 1 to include the input date
      var holidays = holidayRange.flat().map(function (date) {
        return new Date(date).toISOString().slice(0, 10);
      });

      while (count < numberOfDays) {
        currentDate.setDate(currentDate.getDate() + 1);

        // Check if the current day is a weekend (Saturday or Sunday)
        if (currentDate.getDay() == 0 || currentDate.getDay() == 6) {
          continue;
        }

        // Check if the current day is a holiday
        if (holidays.indexOf(currentDate.toISOString().slice(0, 10)) !== -1) {
          continue;
        }

        count++;
      }

      output.push([currentDate]);
    }
  }

  return output;
}
