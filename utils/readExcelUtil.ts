import * as XLSX from 'xlsx';
import * as path from 'path';

// Load workbook ONCE (important)
const workbook = XLSX.readFile(path.resolve(process.env.excelFilePath!));

export function getData(
  sheetName: string,
  testcaseID: string
): Record<string, string> {

  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }

  const range = XLSX.utils.decode_range(sheet['!ref']!);

  const result: Record<string, string> = {};

  // Read header row (row 0)
  const headers: string[] = [];

  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    const cell = sheet[cellAddress];
    headers.push(cell?.v || '');
  }

  // Loop rows (like Katalon)
  for (let row = 1; row <= range.e.r; row++) {

    const tcCellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
    const tcCell = sheet[tcCellAddress];

    // Match TC_ID (column 0)
    if (tcCell?.v === testcaseID) {

      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = sheet[cellAddress];

        const key = headers[col];
        const value = cell?.v ?? '';

        result[key] = String(value);
      }

      return result; // stop immediately
    }
  }

  throw new Error(`TestcaseID "${testcaseID}" not found`);
}