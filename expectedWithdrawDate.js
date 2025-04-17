/**
 * Calculates the expected withdrawal date by adding a specified number of school days to a given date,
 * excluding weekends and holidays.
 *
 * @param {Date} inputDate - The date when the student started their DAEP placement.
 * @param {number} numberOfDays - The number of school days the student was assigned to DAEP.
 * @param {Date[]} holidays - An array of holiday dates to skip (e.g., `[Holiday1, Holiday2, ...]`).
 * @param {number[]} additionalDays - An array containing two numbers: [H, I], where H is the number of 
 * absences and I is an additional adjustment for the exit day estimation.
 * @returns {Date|null} The estimated exit day from DAEP, or null if any input is invalid.
 */
function NAHS_EXPECTED_WITHDRAW_DATE(inputDate, numberOfDays, holidays, additionalDays) {
  if (!inputDate || isNaN(new Date(inputDate)) || isNaN(numberOfDays) || 
      !additionalDays || isNaN(additionalDays[0]) || isNaN(additionalDays[1])) {
    return null; // Return null if any input is invalid
  }

  const inputDateObj = new Date(inputDate);
  const additionalDaysH = Number(additionalDays[0]);
  const additionalDaysI = Number(additionalDays[1]);
  
  // Total school days to count
  const totalDays = numberOfDays + (additionalDaysI - additionalDaysH);
  
  let currentDate = new Date(inputDateObj);
  let count = 1; // Start counting from 1 for the first school day
  let firstIteration = true; // Flag to control the first iteration

  // Convert holidays to ISO date strings for easy comparison
  const formattedHolidays = holidays.map(date => new Date(date).toISOString().slice(0, 10));

  // Loop until we reach the required number of school days
  while (count < totalDays) {
    // Move to the next day only if it's not the first iteration
    if (!firstIteration) {
      currentDate.setDate(currentDate.getDate() + 1);
    } else {
      firstIteration = false; // Set to false after the first loop
    }
    
    // Check if the day is a weekend or holiday
    const isWeekend = (currentDate.getDay() === 0 || currentDate.getDay() === 6);
    const isHoliday = formattedHolidays.includes(currentDate.toISOString().slice(0, 10));
    
    // Only increment count for valid school days
    if (!isWeekend && !isHoliday) {
      count++;
    }
  }
  
  // Final adjustment if the currentDate lands on a weekend or holiday after the loop
  while (currentDate.getDay() === 0 || currentDate.getDay() === 6 || formattedHolidays.includes(currentDate.toISOString().slice(0, 10))) {
    currentDate.setDate(currentDate.getDate() + 1); // Move forward to the next valid school day
  }

  return currentDate; // Return the final adjusted date
}




