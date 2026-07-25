import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { GlobalConfig } from '../config/globalConfig';

export async function writeReportRow(
    userID: string,
    testcaseDescription: string,
    testCaseType: string,
    expectedResult: string
  ) {

  const filePath = path.join(
      GlobalConfig.reportPath,
      GlobalConfig.date,
      GlobalConfig.planName,
      'Test_Report.xlsx'
    );

  const workbook = new ExcelJS.Workbook();

  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath);
  }

  let sheet = workbook.getWorksheet("Report");

  
  if (!sheet) {
    sheet = workbook.addWorksheet("Report");
  }


  //  Add row (keeps formatting intact)
  sheet.addRow([
    GlobalConfig.testCaseID,
    userID,
    GlobalConfig.proposalNo,
    GlobalConfig.planName,
    testcaseDescription,
    testCaseType,
    expectedResult,
    GlobalConfig.actualResult,
    GlobalConfig.actualResultSteps,
    GlobalConfig.status,
    `${GlobalConfig.date}_${GlobalConfig.time}`,
    GlobalConfig.executionTime,
    GlobalConfig.screenshotDir,
    GlobalConfig.basePremAmount,
    GlobalConfig.totalAmount,
    GlobalConfig.saAmount,
    GlobalConfig.apAmount
    // rest fields...
  ]);

  await workbook.xlsx.writeFile(filePath);

  console.log(` Excel updated successfully -> ${filePath}`);
}
