import { Page, Locator } from '@playwright/test';
import { ScreenshotUtil } from '../../utils/screenshotUtil';
import { getData } from '../../utils/readExcelUtil';
import { DropdownActions } from '../../utils/dropdownsUtil';
import { handleBI } from '../../utils/downloadBIUtil';
import { riderDetails } from '../../utils/ridersUtil';
import { validationCases } from '../../utils/validationCasesUtil';

export class FPP {

    readonly page: Page;

    // Locators
    readonly productName: (planName: string) => Locator;
    readonly age: Locator;
    // readonly premiumInput: Locator;
    readonly SAInput: Locator;
    readonly calculateBtn: Locator;
    readonly calculate2: Locator;
    readonly stepRiderCheckbox: Locator;
    readonly nextBtn: Locator;
    readonly next2: Locator;

    constructor(page: Page) {
        this.page = page;

        this.productName = (planName: string) =>
        page.locator(`//h6[contains(normalize-space(.), '${planName}')]`);

        this.age = page.locator("//input[@name='Age']");
        this.SAInput = page.locator("//input[@name='SumAssured']");
        this.calculateBtn = page.locator("//button[@id='Newplan_Cal']");
        this.stepRiderCheckbox = page.locator("(//label[contains(text(),'Step Up Rider')]/parent::div/label/span/input)[1]");
        this.nextBtn = page.locator("//span[normalize-space(text())='Next']");
        this.calculate2 = page.locator("xpath=//button[@id='#Calculate']");
        this.next2 = page.locator("xpath=//button[text()='Next']");
    }

    // ✅ Single method (as requested)
    async fillPlanDetails(testcaseID: string) {

        const data = getData('Plan_Details_Page', testcaseID);
        const dropdown = new DropdownActions(this.page);
        const validate = new validationCases(this.page);


        await this.page.waitForLoadState('networkidle');

        // Select Product
        await this.productName(data["Plan_Name"]).waitFor({state: 'visible'});
        await this.productName(data["Plan_Name"]).click();

        await this.page.waitForLoadState('networkidle');

        if (!(data.Plan_Name?.toString().includes("V02"))) {
            await dropdown.selectAntDropdown('AgeProofType', data.LA_Age_Proof);
            await dropdown.selectDropdownValue('Maturity Benefit', data.Maturity_Benefit);

            if(data.Maturity_Benefit === 'Installment') {

				await dropdown.selectDropdownValue('Installment Mode', data.Maturity_Payout);
			}
    
            // Get Age
            const ageStr = await this.age.inputValue();
            const ageInt = parseInt(ageStr);

            if (ageInt > 17 && ageInt < 61) {
                await dropdown.selectAntDropdown('PolicyTerm', data.PT);
                await dropdown.selectAntDropdown('PermiumTerm', data.PPT);
            }
            await dropdown.selectDropdownValue('Premium Mode', data.Frequency);

			await this.SAInput.fill(data.Sum_Assured);

            // Enter Premium
            await this.page.waitForTimeout(1000);

            await ScreenshotUtil.capture(this.page, "Plan_Details");

            // Negative Scenario
            if (data.TestCase_Type?.toString().toLowerCase() === "negative") {

                 // You can call validation helper
                await validate.validatePlanDetails(testcaseID, data.Expected_Result);
                return;
            }

            await this.calculate2.click();


            // Riders
        
            await this.stepRiderCheckbox.waitFor({ state: 'visible', timeout: 5000 });
            await this.page.waitForTimeout(500);
            await this.stepRiderCheckbox.click();   

            const rider = new riderDetails(this.page);
            await rider.fillRiderDetails(testcaseID);

            await this.calculate2.click();

            await this.page.waitForLoadState('networkidle');

            await this.next2.scrollIntoViewIfNeeded();

            await ScreenshotUtil.capture(this.page, "Plan_Details");

            // await CaptureAmounts.getValues(this.page);

            await this.next2.click();

            await handleBI(this.page, data.BI_Required);
        }else{

            await dropdown.selectAntDropdown('AgeProofType', data.LA_Age_Proof);

			await dropdown.selectAntDropdown('Option', data.Life_Cover);

			await dropdown.selectAntDropdown('Deathbenefit', data.Death_Benefit);

			if(data.Death_Benefit.toString().includes('Installment')) {

				await dropdown.selectAntDropdown('DeathPayoutMode', data.Death_Payout);
				await dropdown.selectAntDropdown('DeathPayoutPeriod', data.Death_Payout_Period);
            }
    		await dropdown.selectAntDropdown('PremFreqmode', data.Frequency);

            // Get Age
            const ageStr = await this.age.inputValue();
            const ageInt = parseInt(ageStr);

            if(ageInt > 17 && ageInt < 61) {


				await dropdown.selectAntDropdown('PolicyTerm', data.PT);
				await this.page.waitForLoadState('networkidle');

				await dropdown.selectAntDropdown('PermiumTerm', data.PPT);
			}
            await this.SAInput.fill(data.Sum_Assured);

            // Enter Premium
            await this.page.waitForTimeout(1000);

            await ScreenshotUtil.capture(this.page, "Plan_Details");
            if (data.TestCase_Type?.toString().toLowerCase() === "negative") {

                 // You can call validation helper
                await validate.validatePlanDetails(testcaseID, data.Expected_Result);
                return;
            }
            await this.calculateBtn.click();
        	await this.page.waitForLoadState('networkidle');

            // Riders
            await this.stepRiderCheckbox.waitFor({ state: 'visible', timeout: 5000 });
            await this.page.waitForTimeout(500);
            await this.stepRiderCheckbox.click();  

            const rider = new riderDetails(this.page);
            await rider.fillRiderDetails(testcaseID);

            await this.calculateBtn.click();
            await this.page.waitForLoadState('networkidle');
            await this.nextBtn.scrollIntoViewIfNeeded();
            await ScreenshotUtil.capture(this.page, "Plan_Details");

            // await CaptureAmounts.getValues(this.page);

            await this.nextBtn.click();


        }

    }

}