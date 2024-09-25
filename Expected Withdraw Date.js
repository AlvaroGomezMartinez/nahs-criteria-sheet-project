/**
 * Calculates the expected withdrawal date by adding a specified number of school days to a given date,
 * excluding weekends and holidays.
 *
 * @param {Date[][]} inputDateRange - A 2D array of starting dates (e.g., `[[Date1], [Date2], ...]`).
 * @param {number[][]} numberOfDaysRange - A 2D array containing the number of school days to add to each starting date (e.g., `[[Days1], [Days2], ...]`).
 * @param {Date[]} holidayRange - A 1D array of holiday dates to skip (e.g., `[Holiday1, Holiday2, ...]`).
 * @param {number[][]} additionalDaysRange - A 2D array where each row represents columns H, I, and optionally other columns, which affect the calculation (e.g., `[[H, I, G, W], [H, I, G, W], ...]`).
 * @return {Date[][]} - A 2D array of resulting dates after adjusting for school days, holidays, and additional days (e.g., `[[ExpectedDate1], [ExpectedDate2], ...]`).
 * @customfunction
 */
function NAHS_EXPECTED_WITHDRAW_DATE(
  inputDateRange,
  numberOfDaysRange,
  holidayRange,
  additionalDaysRange
) {
  var output = [];

  for (var i = 0; i < inputDateRange.length; i++) {
    var inputDate = new Date(inputDateRange[i][0]);
    var numberOfDays = Number(numberOfDaysRange[i][0]); // Changed to [0] to extract number

    var H = Number(additionalDaysRange[i][0]); // First column in additionalDaysRange
    var I = Number(additionalDaysRange[i][1]); // Second column in additionalDaysRange

    if (isNaN(inputDate) || isNaN(numberOfDays) || isNaN(H) || isNaN(I)) {
      output.push([null]);
    } else {
      // Calculate the additional days to be added
      var additionalDays = I - H; // Add or remove other calculations as needed

      // Update the number of days to be added to inputDate
      numberOfDays += additionalDays;

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

// function EXPECTED_WITHDRAW_DATE(inputDateRange, numberOfDaysRange, holidayRange) {
//   var output = [];

//   for (var i = 0; i < inputDateRange.length; i++) {
//     var inputDate = new Date(inputDateRange[i][0]);
//     var numberOfDays = Number(numberOfDaysRange[i]);

//     if (isNaN(inputDate) || isNaN(numberOfDays)) {
//       output.push([null]);
//     } else {

//       var currentDate = new Date(inputDate);
//       var count = 1; // Start count at 1 to include the input date
//       var holidays = holidayRange.flat().map(function (date) {
//         return new Date(date).toISOString().slice(0, 10);
//       });

//       while (count < numberOfDays) {
//         currentDate.setDate(currentDate.getDate() + 1);

//         // Check if the current day is a weekend (Saturday or Sunday)
//         if (currentDate.getDay() == 0 || currentDate.getDay() == 6) {
//           continue;
//         }

//         // Check if the current day is a holiday
//         if (holidays.indexOf(currentDate.toISOString().slice(0, 10)) !== -1) {
//           continue;
//         }

//         count++;
//       }

//       output.push([currentDate]);
//     }
//   }

//   return output;
// }
