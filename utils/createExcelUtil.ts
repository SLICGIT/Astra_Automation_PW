import * as fs from 'fs';
import * as path from 'path';
import ExcelJS from 'exceljs';
import { GlobalConfig } from '../config/globalConfig';


export async function createReportSheet() {

  const filePath = path.join(
    GlobalConfig.reportPath,
    GlobalConfig.date,
    GlobalConfig.planName,
    'Test_Report.xlsx'
  );

  // Create directory if not exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  if (!fs.existsSync(filePath)) {

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Report");

    // Headers
    const headers = [
      "Qrace_TestCase_ID",
      "User_ID",
      "Proposal_No",
      "Plan Name",
      "Test Case Description",
      "Test Case Type",
      "Expected Result",
      "Actual Result",
      "Actual Result Execution Steps",
      "Status",
      "Date & Time",
      "Execution Duration",
      "Screenshot Path",
      "Base Premium",
      "Total Premium",
      "Sum Assured",
      "Annualized Premium"
    ];

    // Add header row
    const headerRow = sheet.addRow(headers);

    // Style header
    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0000FF' }
      };
    });

    // Auto-size columns
    headers.forEach((_, i) => {
      const column = sheet.getColumn(i + 1);
      column.width = 25; // ExcelJS doesn't auto-size perfectly, so set fixed width
    });

    // Save file
    await workbook.xlsx.writeFile(filePath);

    console.log(`Excel report generated at: ${filePath}`);
  }
}