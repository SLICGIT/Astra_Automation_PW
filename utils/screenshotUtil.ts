import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { GlobalConfig } from '../config/globalConfig';
import { getData } from '../utils/readExcelUtil';

export class ScreenshotUtil {

  //  Equivalent of capture()
  static async capture(page: Page, pageName: string): Promise<string> {
    const fileName = `${String(GlobalConfig.ssCount).padStart(3, '0')}_${pageName}.png`;
    const fullPath = path.join(GlobalConfig.screenshotDir, fileName);

    await page.screenshot({ path: fullPath, fullPage: true });
    await page.screenshot

    GlobalConfig.ssCount++;

    return fullPath;
  }

  //  Equivalent of screenshotDir()
  static createScreenshotDir(tcID: string): void {
    const data = getData('Plan_Details_Page', tcID);

    GlobalConfig.planName = data.Plan_Name;
    GlobalConfig.testCaseID = tcID;

    const now = new Date();
    GlobalConfig.date = now.toLocaleDateString('en-GB').split('/').join('-'); // dd-MM-yyyy
    GlobalConfig.time = now.toTimeString().split(' ')[0].split(':').join('-'); // HH-mm-ss

    GlobalConfig.screenshotDir = path.join(
      GlobalConfig.screenshotDir,
      GlobalConfig.date,
      GlobalConfig.planName,
      `${GlobalConfig.testCaseID}_${GlobalConfig.time}`
    );

    console.log(`Screenshot Directory : ${GlobalConfig.screenshotDir}`)

    fs.mkdirSync(GlobalConfig.screenshotDir, { recursive: true });
    // GlobalConfig.ssCount = 1; // reset counter per test case
  }
}