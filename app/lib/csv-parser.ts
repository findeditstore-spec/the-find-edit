/**
 * RFC 4180 compliant CSV parser
 * Handles quoted fields, escaped quotes, and multiline values
 */

export interface CSVParseResult {
  headers: string[];
  rows: string[][];
  error?: string;
  rowCountExceeded?: boolean;
}

export function parseCSV(text: string, maxRows: number = 25): CSVParseResult {
  // Validate input
  if (!text || typeof text !== "string") {
    return { headers: [], rows: [], error: "Invalid CSV content" };
  }

  if (text.length > 1024 * 1024) {
    // 1MB limit
    return { headers: [], rows: [], error: "CSV file too large (max 1MB)" };
  }

  const lines = text.split("\n");
  if (lines.length < 2) {
    return {
      headers: [],
      rows: [],
      error: "CSV must contain headers and at least one data row",
    };
  }

  try {
    // Parse header row
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine);

    if (headers.length === 0) {
      return { headers: [], rows: [], error: "No headers found" };
    }

    // Parse data rows - count total rows even if we hit the limit
    const rows: string[][] = [];
    let currentLine = "";
    let inQuotes = false;
    let totalRowsEncountered = 0;
    let limitExceeded = false;

    for (let i = 1; i < lines.length; i++) {
      currentLine += (currentLine ? "\n" : "") + lines[i];

      // Count unescaped quotes to track if we're inside a quoted field
      let quoteCount = 0;
      for (let j = 0; j < currentLine.length; j++) {
        if (currentLine[j] === '"') {
          // Check if it's escaped (preceded by another quote)
          if (j > 0 && currentLine[j - 1] === '"') {
            j++; // Skip the next quote
          } else {
            quoteCount++;
          }
        }
      }

      inQuotes = quoteCount % 2 === 1;

      // If we're not inside quotes, this line is complete
      if (!inQuotes) {
        if (currentLine.trim()) {
          try {
            const row = parseCSVLine(currentLine);
            if (row.length > 0) {
              totalRowsEncountered++;

              // Only add row if we haven't exceeded the limit
              if (rows.length < maxRows) {
                rows.push(row);
              } else if (!limitExceeded) {
                // First time we hit the limit
                limitExceeded = true;
              }
            }
          } catch (err) {
            return {
              headers,
              rows,
              error: `Malformed CSV at row ${rows.length + 2}: ${err instanceof Error ? err.message : "Unknown error"}`,
            };
          }
        }
        currentLine = "";
      }
    }

    // If we still have content in buffer, it's incomplete
    if (currentLine.trim()) {
      return {
        headers,
        rows,
        error: "Incomplete CSV row (unclosed quoted field)",
      };
    }

    if (rows.length === 0) {
      return { headers, rows: [], error: "No data rows found" };
    }

    // If we encountered more rows than the limit, report that clearly
    if (limitExceeded || totalRowsEncountered > maxRows) {
      return {
        headers,
        rows,
        error: `CSV contains ${totalRowsEncountered} products. Maximum is ${maxRows}. Please split the file and try again.`,
        rowCountExceeded: true,
      };
    }

    return { headers, rows };
  } catch (err) {
    return {
      headers: [],
      rows: [],
      error: `CSV parse error: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      // Field separator
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  // Add the last field
  fields.push(current.trim());

  return fields;
}
