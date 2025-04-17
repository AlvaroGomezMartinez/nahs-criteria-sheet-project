function pushDataToReviewDateSheet(updatedDataMap) {
  // Get the Review_Date sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Review_Date");

  if (!sheet) {
    throw new Error("Sheet 'Review_Date' not found.");
  }

  // Optional: Clear existing data in the sheet
  sheet.clearContents();

  // Define the headers for the columns
  const headers = ["Name", "ID", "Review Date"];
  const data = [headers]; // Initialize data array with headers

  // Helper function to format date to MM/DD/YY
  function formatDate(date) {
    if (date instanceof Date && !isNaN(date)) {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${month}/${day}/${year}`;
    }
    return date; // Return as-is if not a valid date
  }

  // Process each entry in the map
  updatedDataMap.forEach((dataObject, studentId) => {
    // Access the activeData and review objects directly from dataObject
    const activeData = dataObject.activeData;
    const review = dataObject.review;

    // If either activeData or review is found, use it as the source
    if (activeData || review) {
      const source = activeData || review;

      // Extract Name, ID, and Review Date from the chosen source
      const { Name = "", ID = "", "Review Date": reviewDate } = source;

      // Format reviewDate if it's a valid date
      const formattedReviewDate = reviewDate ? formatDate(new Date(reviewDate)) : "";

      // Push a row with Name, ID, and formatted Review Date to the data array
      data.push([Name, ID, formattedReviewDate]);
    } else {
      Logger.log(`No activeData or review found for studentId: ${studentId}`);
    }
  });


  // Set the range for data and write it to the sheet
  sheet.getRange(1, 1, data.length, headers.length).setValues(data);
}

