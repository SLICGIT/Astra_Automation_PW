import * as XLSX from 'xlsx';
 
export function getExecutableTestData(
  filePath: string,
  sheetName: string
): any[] {
 
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
 
  const allRows = XLSX.utils.sheet_to_json(sheet);
 
  //  Filter only Execute = Yes
  return allRows.filter((row:any) =>
      row.Executor?.toString().trim().toLowerCase() === 'yes'
  );
}