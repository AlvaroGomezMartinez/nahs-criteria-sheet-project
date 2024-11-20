/**
 * @author Alvaro Gomez<alvaro.gomez@nisd.net>, Academic Technology Coach
 * Office: 210-397-9408
 * Mobile: 210-363-1577
 *
 * @description The objective of this project is to create
 * a spreadsheet that provides information to NAHS Administrators
 * and counselors.
 * 
 * Latest updates made on: 10/31/24
 * 
 * TODO: Create unit tests for:
 *          1. determining the Estimated Days Left
 *          2. handling blanks from the Alt_HS_Enrollment_Count
 *          3. handling blanks from Registrations sheet.
 *          The statements that calculate the data are in the writeToActiveSheet.gs file
 * TODO: Verify the formula that updates the counsleor sheets outputs accurately; update
 *       it if necessary.
 * TODO: Update the function that pushes data to Review_Date. Currently it only
 *       pushes data to it, it needs to pull and update the Review Date column
 *       in Active.
 */

/**
 * This is the main function of the project.
 *
 * @description This function loads active students' data, registrations data,
 *              attendance data, and entry/withdrawal data from their respective
 *              sources. It performs four joins to merge this information into
 *              a single data structure. The merged data is then written to the
 *              "Active" sheet in the bound spreadsheet.
 *
 * @returns {Map<string, object>} A Map where the keys are student IDs and
 *                                the values are objects containing student
 *                                data such as their registration, attendance,
 *                                days and past DAEP placement information.
 */
function main() {
  // Prepare the "Active" sheet for data loading and joining, by unmerging the cells in column A
  unmergeAndFillColumnA();

  // Load data and build the initial maps for active students, registration, attendance, and enrollment
  const reviewData = loadReviewDateData();
  const activeStudentsData = loadActiveStudentsData();
  const registrationsData = loadRegistrationsData();
  const attendanceData = loadStudentAttendanceData();
  const entryWithdrawalData = loadEntryWithdrawalData();

  /**
   * This is the 1st join operation.
   * 
   * This is a left join between activeStudentsData and entryWithdrawalData.
   * The result is a map of students who are listed in Active and were also
   * active in the entryWithdrawalData map.
   */
  const leftoverActiveStudentDataMap = new Map();
  // Step 1: Add all entries from activeStudentsData to the result map
  activeStudentsData.forEach((studentDataArray, studentId) => {
    leftoverActiveStudentDataMap.set(studentId, {
      activeData: studentDataArray[0],
      withdrawnData: null, // Initialize withdrawnData as null
    });
  });

  // Step 2: Add or update entries in leftoverActiveStudentDataMap using entryWithdrawalData
  entryWithdrawalData.forEach((entryWithdrawalArray, studentId) => {
    // Get the last element of entryWithdrawalArray
    const lastEntry = entryWithdrawalArray[entryWithdrawalArray.length - 1];

    // Check if "Withdrawal Code" is an empty string
    if (lastEntry["Withdrawal Code"] === "") {
      if (leftoverActiveStudentDataMap.has(studentId)) {
        // If studentId exists, add lastEntry to withdrawnData array
        const existingData = leftoverActiveStudentDataMap.get(studentId);
        const updatedWithdrawnData = existingData.withdrawnData || []; // Use existing withdrawnData or initialize an array
        updatedWithdrawnData.push(lastEntry);

        leftoverActiveStudentDataMap.set(studentId, {
          ...existingData,
          withdrawnData: updatedWithdrawnData, // Update withdrawnData without changing activeData
        });
      } else {
        // If studentId does not exist, add a new entry with lastEntry in withdrawnData
        leftoverActiveStudentDataMap.set(studentId, {
          activeData: activeStudentsData.get(studentId) || null, // Keep activeData if available, or set to null
          withdrawnData: [lastEntry], // Initialize withdrawnData as an array containing lastEntry
        });
      }
      console.log(`Added lastEntry to withdrawnData for studentId ${studentId}`);
    } else {
      console.log(`Skipping studentId ${studentId} - Reason: Withdrawal Code is not empty`);
    }
  });

  /**
   * This is the 2nd join operation.
   * 
   * Perform a left join with leftoverActiveStudentDataMap and registrationsData.
   * The purpose of this join is to add the data from registrationsData to
   * updatedActiveStudentDataMap to help build the updated "Active" sheet.
   */
  const updatedUpdatedActiveStudentDataMap = new Map();

  leftoverActiveStudentDataMap.forEach((studentData, studentId) => {
    // Get registration data for the current student or null if not found
    const registrationData = registrationsData.get(studentId) || null;

    // Get the last element of registrationsData map, so that we have the latest enrollment data for repeaters
    const lastEntry = registrationData ? registrationData[registrationData.length - 1] : null;

    // Merge student data with registration data and store it in the updatedUpdatedActiveStudentDataMap map
    updatedUpdatedActiveStudentDataMap.set(studentId, {
      ...studentData,
      registration: lastEntry,
    });
  });

  
  /**
   * This is the 3rd join operation.
   * 
   * Perform a left join updatedUpdatedActiveStudentDataMap and attendanceData.
   * The purpose of this join is to add the data from the
   * "Alt_HS_Attendance_Enrollment_Count" sheet to help build the
   * updated "Active" sheet's data.
   */
  const updatedUpdatedUpdatedActiveStudentDataMap = new Map();

  const HEADINGS = ["BUILDING", "CAMPUS", "STU ID", "STUDENT", "DAYS IN ATT", "DAYS IN Enrl", "Present", "ALL_"];

  updatedUpdatedActiveStudentDataMap.forEach((studentData, studentId) => {
    const normalizedStudentId = String(studentId).trim();
    let attendance = attendanceData.get(normalizedStudentId) || null;

    // Initialize a single attendance object to store expanded attendance data
    const attendanceObject = {};

    if (attendance && Array.isArray(attendance)) {
      attendance.forEach((entry) => {
        // Map each entry to an object with fields from HEADINGS
        if (Array.isArray(entry)) {
          entry.forEach((value, idx) => {
            attendanceObject[HEADINGS[idx] || `field${idx + 1}`] = value;
          });
        } else {
          // If entry is already an object, merge it as-is
          Object.assign(attendanceObject, entry);
        }
      });
    }

    // Merge the existing student data with the single attendance object
    updatedUpdatedUpdatedActiveStudentDataMap.set(studentId, {
      ...studentData,
      attendance: attendanceObject,
    });
  });


  /**
   * This is the 4th join operation.
   * 
   * Perform a left join with updatedUpdatedUpdatedActiveStudentDataMap and reviewDateDataMap.
   * The purpose of this join is to add the data from reviewDateData to
   * updatedUpdateUpdateActiveStudentDataMap to help build the updated "Active" sheet.
   */
    const updatedUpdatedUpdatedUpdatedActiveStudentDataMap = new Map();

    updatedUpdatedUpdatedActiveStudentDataMap.forEach((studentData, studentId) => {
      // Get reviewDate data for the current student or null if not found
      const reviewDataArray = reviewData.get(studentId) || null;

      // Initialize an empty object to hold filtered review data
      let reviewDataObject = {};

      // If reviewDataArray is an array, only extract "Name", "ID", and "Review Date"
      if (Array.isArray(reviewDataArray)) {
        reviewDataArray.forEach(item => {
          if (item.Name) reviewDataObject.Name = item.Name;
          if (item.ID) reviewDataObject.ID = item.ID;
          if (item["Review Date"]) reviewDataObject["Review Date"] = item["Review Date"];
        });
      } else {
        // If it's not an array, keep it as-is
        reviewDataObject = reviewDataArray;
      }

      // Merge student data with the filtered reviewDataObject and store in updated map
      updatedUpdatedUpdatedUpdatedActiveStudentDataMap.set(studentId, {
        ...studentData,
        review: reviewDataObject,
      });
    });

  pushDataToReviewDateSheet(updatedUpdatedUpdatedUpdatedActiveStudentDataMap);

  // Write the merged result to the "Active" sheet
  writeToActiveSheet(updatedUpdatedUpdatedUpdatedActiveStudentDataMap);

  // Update the counselor sheets
  pushRowsToCounselorSheet();

  // Add comment to cell A1 in each of the four sheets
  addTimestampedCommentToSheets();

  // Return the merged data map
  return updatedUpdatedUpdatedUpdatedActiveStudentDataMap;
}
