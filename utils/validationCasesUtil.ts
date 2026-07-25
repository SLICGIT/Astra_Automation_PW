import { Locator, Page, expect } from '@playwright/test';
import { ScreenshotUtil } from './screenshotUtil';
import { getData } from './readExcelUtil';
import { GlobalConfig } from '../config/globalConfig';

export class validationCases {
    readonly page: Page;

    // Locators
    readonly calculateBtn: Locator; 
    readonly stepRiderCheckbox: Locator;
    readonly validationMsg: Locator;

    constructor(page: Page) {
        this.page = page;

        this.calculateBtn = page.locator("//button[@id='Newplan_Cal']");
        this.stepRiderCheckbox = page.locator("(//label[contains(text(),'Step Up Rider')]/parent::div/label/span/input)[1]");
        this.validationMsg = page.locator("//div[@class='ant-notification-notice-message']");
    }

    async validatePlanDetails(testCaseID: string, expectedMessage: string) {

        const data = getData("Plan_Details_Page", testCaseID);

        // Rider condition
        if (
            data['AB_Rider']?.includes("Yes") ||
            data['FIB_Rider']?.includes("Yes") ||
            data['EIC_Rider']?.includes("Yes") ||
            data['CIWCare_Rider']?.includes("Yes") ||
            data['CIW_Mat_Rider']?.includes("Yes") ||
            data['CIP_Rider']?.includes("Yes") ||
            data['Step_Rider']?.includes("Yes") ||
            data['Arogya_Rider']?.includes("Yes") ||
            data['ADD_Rider']?.includes("Yes") ||
            data['CIC_Rider']?.includes("Yes") ||
            data['ADDI_Rider']?.includes("Yes")
        ) {

            // Click calculate
            // await this.page.waitForTimeout(1000);
            await this.calculateBtn.waitFor({state: 'visible'});
            await this.calculateBtn.click();

            // Click Step Rider checkbox
            await this.stepRiderCheckbox.waitFor({ state: 'visible' });
            await this.page.waitForTimeout(500);
            await this.stepRiderCheckbox.click();

            // Call Rider Details
            // await new RiderDetailsUlip(this.page).fillRiderDetails();

        }

        // Final Calculate
        await this.calculateBtn.waitFor({state: 'visible'});
        await this.calculateBtn.click();

        // Wait for validation message
        await this.validationMsg.waitFor({ state: 'visible' });

        GlobalConfig.actualResult = (await this.validationMsg.innerText()).toLowerCase();
        const expected = expectedMessage.toLowerCase();

        console.log("Actual:", GlobalConfig.actualResult );
        console.log("Expected:", expected);

        // Screenshot
        await this.page.waitForTimeout(200);
        await ScreenshotUtil.capture(this.page, "Validation Message");

        // Validation
        if (GlobalConfig.actualResult  === expected || GlobalConfig.actualResult.includes(expected)) {
            console.log("Validation passed:", GlobalConfig.actualResult);
        } else {
            throw new Error("Validation message is incorrect.");
        }
    }
}