
export interface CSVParseResult {
  headers: string[];
  rows: string[][];
  error?: string;
  rowCountExceeded?: boolean;
}

export function parseCSV(text: string, maxRows: number = 25): CSVParseResult {
  if (typeof text !== "string" || !text.trim()) {
    return { headers: [], rows: [], error: "Invalid CSV content" };
  }

  if (text.length > 1024 * 1024) {
    return {
      headers: [],
      rows: [],
      error: "CSV file too large (max 1MB)",
    };
  }

  if (!Number.isInteger(maxRows) || maxRows < 1) {
    return { headers: [], rows: [], error: "Invalid row limit" };
  }

  const source = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const records: string[][] = [];
  let fields: string[] = [];
  let field = "";
  let inQuotes = false;
  let quoteClosed = false;
  let recordStarted = false;

  const finishField = () => {
    fields.push(field.trim());
    field = "";
    quoteClosed = false;
  };

  const finishRecord = () => {
    finishField();

    if (fields.some((value) => value.length > 0)) {
      records.push(fields);
    }

    fields = [];
    recordStarted = false;
  };

  try {
    for (let i = 0; i < source.length; i++) {
      const char = source[i];
      const next = source[i + 1];

      if (inQuotes) {
        if (char === '"') {
          if (next === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
            quoteClosed = true;
          }
        } else {
          // Preserve line breaks inside quoted fields.
          field += char;
        }

        continue;
      }

      if (char === "\r" || char === "\n") {
        if (char === "\r" && next === "\n") {
          i++;
        }

        finishRecord();
        continue;
      }

      if (char === ",") {
        finishField();
        recordStarted = true;
        continue;
      }

      if (char === '"') {
        if (field.length === 0 && !quoteClosed) {
          inQuotes = true;
          recordStarted = true;
          continue;
        }

        throw new Error(`Unexpected quote at character ${i + 1}`);
      }

      if (quoteClosed) {
        if (char.trim() !== "") {
          throw new Error(
            `Unexpected character after closing quote at character ${i + 1}`
          );
        }

        // Ignore whitespace between a closing quote and a delimiter.
        continue;
      }

      field += char;
      recordStarted = true;
    }

    if (inQuotes) {
      throw new Error("Incomplete CSV row (unclosed quoted field)");
    }

    if (recordStarted || fields.length > 0 || field.length > 0 || quoteClosed) {
      finishRecord();
    }
  } catch (err) {
    return {
      headers: [],
      rows: [],
      error: `Malformed CSV: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
    };
  }

  if (records.length < 2) {
    return {
      headers: [],
      rows: [],
      error: "CSV must contain headers and at least one data row",
    };
  }

  const headers = records[0].map((header) => header.trim());

  if (headers.some((header) => !header)) {
    return { headers, rows: [], error: "CSV contains an empty header" };
  }

  if (new Set(headers.map((header) => header.toLowerCase())).size !== headers.length) {
    return { headers, rows: [], error: "CSV contains duplicate headers" };
  }

  const dataRows = records.slice(1);

  if (dataRows.some((row) => row.length !== headers.length)) {
    return {
      headers,
      rows: [],
      error: "CSV contains rows with a different number of columns than the header",
    };
  }

  if (dataRows.length > maxRows) {
    return {
      headers,
      rows: dataRows.slice(0, maxRows),
      error: `CSV contains ${dataRows.length} products. Maximum is ${maxRows}. Please split the file and try again.`,
      rowCountExceeded: true,
    };
  }

  return { headers, rows: dataRows };
}
