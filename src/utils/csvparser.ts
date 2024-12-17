/**
 * Parses a CSV file into a 2D array of strings.
 * @param {File} file The CSV file to be parsed.
 * @returns {Promise<Array<Array<string>>>} A promise that resolves to a 2D array of strings (rows and columns).
 */
export function parseCSVFile(file: File): Promise<Array<Array<string>>> {
  return new Promise((resolve, reject) => {
    // Check if the file is a text file or Excel CSV type
    if (!file.type.includes('text') && !file.type.includes('ms-excel')) {
      reject(new Error('The file is not a valid text file.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const csvData = reader.result as string;
      try {
        const rows = parseCSV(csvData); // Use the helper to parse the data
        resolve(rows);
      } catch (error) {
        reject(new Error('Error parsing CSV data.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading the file.'));
    };

    reader.readAsText(file); // Read the file as a text string
  });
}

/**
 * Helper function to parse CSV string into a 2D array of strings.
 * @param {string} csvData The CSV data as a raw string.
 * @returns {Array<Array<string>>} Parsed 2D array (rows and columns).
 */
function parseCSV(csvData: string): Array<Array<string>> {
  const rows = csvData.trim().split('\n'); // Split the CSV into rows
  return rows.map((row) => row.split(',').map((cell) => cell.trim())); // Split each row into columns and trim whitespace
}
