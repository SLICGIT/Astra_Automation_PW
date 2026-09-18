import { Page, Locator } from '@playwright/test';
import { ScreenshotUtil } from '../../utils/screenshotUtil';
import { getData } from '../../utils/readExcelUtil';
import { DropdownActions } from '../../utils/dropdownsUtil';
import { handleBI } from '../../utils/downloadBIUtil';
import { riderDetails } from '../../utils/ridersUtil';
import { validationCases } from '../../utils/validationCasesUtil';

export class ECP {

    readonly page: Page;

    // Locators
    readonly productName: (planName: string) => Locator;
    readonly age: Locator;
    readonly SAInput: Locator;
    readonly calculateBtn: Locator;
    readonly stepRiderCheckbox: Locator;
    readonly nextBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        this.productName = (planName: string) =>
        page.locator(`//h6[contains(normalize-space(.), '${planName}')]`);

        this.age = page.locator("//input[@name='Age']");
        this.SAInput = page.locator("//input[@name='SumAssured']");
        this.calculateBtn = page.locator("//button[@id='Newplan_Cal']");
        this.stepRiderCheckbox = page.locator("(//label[contains(text(),'Step Up Rider')]/parent::div/label/span/input)[1]");
        this.nextBtn = page.locator("//span[normalize-space(text())='Next']");
    }

    // ✅ Single method (as requested)
    async fillPlanDetails(testcaseID: string) {

        const data = getData('Plan_Details_Page', testcaseID);
        const dropdown = new DropdownActions(this.page);

        await this.page.waitForLoadState('networkidle');

        // Select Product
        await this.productName(data["Plan_Name"]).waitFor({state: 'visible'});
        await this.productName(data["Plan_Name"]).click();

        await this.page.waitForLoadState('networkidle');

        // Dropdown selections
        await dropdown.selectAntDropdown('AgeProofType', data.LA_Age_Proof);
        await dropdown.selectAntDropdown('Option', data.Life_Cover);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(500);
        await dropdown.selectAntDropdown('MaturityBenfit', data.Maturity_Benefit);
        await dropdown.selectAntDropdown('Deathbenefit', data.Death_Benefit);

        if (data.Life_Cover === 'Early Cash') {

			await dropdown.selectAntDropdown('SurvivalBen', data.SB_Benefit)
			await dropdown.selectAntDropdown('Surpaymode', data.SB_Payout);

		}

        // await dropdown.selectAntDropdown('PremFreqmode', data.Frequency);
        await dropdown.selectPlanPageDropdown('Premium Frequency', data.Frequency);
        

        // Get Age
        const ageStr = await this.age.inputValue();
        const ageInt = parseInt(ageStr);

        if (ageInt >= 3 && ageInt <= 55) {

            // Below PT, PPT lines are used for ECP V03. Code is commented as V03 is not available in Astra 

            // await dropdown.selectDropdownValueByLabel('Policy Term', data.PT);
			// await dropdown.selectAntDropdown('PermiumTerm', data.PPT);

            let PT: string = (100-ageInt).toString();
            
            if (data.Plan_Name?.toString().includes("V04")) {
                console.log("V04 plan");
        	    await dropdown.selectAntDropdown('PolicyTermSlab', data.Policy_Term_Slab);
                await this.page.waitForLoadState('networkidle')
                await this.page.waitForTimeout(500);

                if (data.Policy_Term_Slab.toLowerCase() === 'wholelife') {
					await dropdown.selectAntDropdown('PolicyTerm', PT);
				} else {
					await dropdown.selectAntDropdown('PolicyTerm', data.PT);
				}

                await dropdown.selectAntDropdown('PremiumTermSlab', data.Premium_Term_Slab);
			} else {

				await dropdown.selectAntDropdown('PolicyTerm', data.PT);
                // await dropdown.selectDropdownValueByLabel('Policy Term', data.PT);
			}
            await dropdown.selectAntDropdown('PermiumTerm', data.PPT);
            // await dropdown.selectDropdownValueByLabel('PermiumTerm', data.PPT);
		}


        // Enter Premium
        await this.SAInput.fill(data.Sum_Assured);
        await this.page.waitForTimeout(1000);

        await ScreenshotUtil.capture(this.page, "Plan_Details");

        // Negative Scenario
        if (data.TestCase_Type?.toString().toLowerCase() === "negative") {

            // You can call validation helper
            // await this.validateError(data['Expected_Result']);
            // return;
            const validate = new validationCases(this.page);
            await validate.validatePlanDetails(testcaseID, data.Expected_Result);
            return;
        }

        await this.calculateBtn.click();

        // Riders
        if (!data.Plan_Name.toString().includes('POS')) {

            await this.stepRiderCheckbox.waitFor({state: 'visible'});
            await this.page.waitForTimeout(500);
            await this.stepRiderCheckbox.click();

            const rider = new riderDetails(this.page);
            await rider.fillRiderDetails(testcaseID);
        }

        await this.calculateBtn.click();

        await this.page.waitForLoadState('networkidle');

        await this.nextBtn.scrollIntoViewIfNeeded();

        await ScreenshotUtil.capture(this.page, "Plan_Details");

        // await CaptureAmounts.getValues(this.page);

        await this.nextBtn.click();

        await handleBI(this.page, data.BI_Required);
    }

}