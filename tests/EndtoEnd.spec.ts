import { test, Locator, Page } from '@playwright/test';


import { getExecutableTestData } from '../utils/excelFilterUtil';
import { ScreenshotUtil } from '../utils/screenshotUtil';
import { GlobalConfig, resetGlobalConfig } from '../config/globalConfig';
import 'dotenv/config';
import { LoginPage } from '../Pages/LoginPage';
import { HomePage } from '../Pages/HomePage';
import { LAPage } from '../Pages/LAPage';

const excelPath = process.env.excelFilePath!;
 console.log(excelPath);

const testData = getExecutableTestData(excelPath, "Login_Page");
console.log("Fetched Data:", testData);
console.log("Count:", testData.length);
// testData.forEach((data, index) => {
for (const data of testData) {

    test(`End to End Execution : ${data.TC_ID}`, async({ page }) => {

        try {
            resetGlobalConfig();
            await ScreenshotUtil.createScreenshotDir(data.TC_ID);
            console.log(process.env.AstraURL!);
            
            //Creating instances of the pages
            const login = new LoginPage(page);
            const home = new HomePage(page, data.TC_ID);
            const LA_Details = new LAPage(page,data.TC_ID);

            login.login(data.TC_ID);
            home.chooseProposalType(data.TC_ID);
            LA_Details.fillLADetails(data.TC_ID);

           

        } catch (error) {
            await ScreenshotUtil.capture(page, "Execution_Failure");
            throw error;
        }

    });
}
// });