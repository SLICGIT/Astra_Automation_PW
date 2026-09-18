import { Page, Locator } from '@playwright/test';
import { ScreenshotUtil } from '../../utils/screenshotUtil';
import { getData } from '../../utils/readExcelUtil';
import { DropdownActions } from '../../utils/dropdownsUtil';
import { handleBI } from '../../utils/downloadBIUtil';
import { riderDetails } from '../../utils/ridersUtil';
import { validationCases } from '../../utils/validationCasesUtil';

export class SPP_SP_POS {

    readonly page: Page;

    // Locators
    readonly productName: (planName: string) => Locator;
    readonly age: Locator;
    readonly premiumInput: Locator;
    readonly calculateBtn: Locator;
    readonly stepRiderCheckbox: Locator;
    readonly nextBtn: Locator;
    readonly SAInput: Locator;
    readonly next2:Locator;

    constructor(page: Page) {
        this.page = page;

        this.productName = (planName: string) =>
        page.locator(`//h6[contains(normalize-space(.), '${planName}')]`);

        this.age = page.locator("//input[@name='Age']");
        this.premiumInput = page.locator("//input[@name='AnnualizePremium']");
        this.calculateBtn = page.locator("//button[@id='Newplan_Cal']");
        this.stepRiderCheckbox = page.locator("(//label[contains(text(),'Step Up Rider')]/parent::div/label/span/input)[1]");
        this.nextBtn = page.locator("//span[normalize-space(text())='Next']");
        this.SAInput = page.locator("//input[@name='SumAssured']");
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

        // Dropdown selections

        await dropdown.selectAntDropdown('AgeProofType', data.LA_Age_Proof);

        await dropdown.selectAntDropdown('Option', data.Life_Cover);

        await dropdown.selectDropdownValue('Death Benefit', data["Death_Benefit"]);


        if(data.Death_Benefit.toString().includes('Installments')) {

            await dropdown.selectAntDropdown('DeathPayoutMode', data.Death_Payout);

        }

        await dropdown.selectAntDropdown('PremFreqmode', data.Frequency);


        // Get Age
        const ageStr = await this.age.inputValue();
        const ageInt = parseInt(ageStr);

            if(ageInt >= 18 && ageInt <= 60) {

                await dropdown.selectDropdownValue('Policy Term', data.PT);

                await this.page.waitForLoadState('networkidle');

                await dropdown.selectAntDropdown('Premium Term', data.PPT);
            }
        
        await this.SAInput.fill(data.Sum_Assured);
        await ScreenshotUtil.capture(this.page, "Plan_Details");

        // Negative Scenario
        if (data.TestCase_Type?.toString().toLowerCase() === "negative") {

            // You can call validation helper
            
            await validate.validatePlanDetails(testcaseID, data.Expected_Result);
            return;
        }
        await this.calculateBtn.click();

        if (!data.Plan_Name.toString().includes('POS')) {

            await this.stepRiderCheckbox.waitFor({ state: 'visible' });
            await this.page.waitForTimeout(500);
            await this.stepRiderCheckbox.click();   

            const rider = new riderDetails(this.page);
            await rider.fillRiderDetails(testcaseID);
        }
        await this.calculateBtn.click();
        await this.nextBtn.scrollIntoViewIfNeeded();
        await ScreenshotUtil.capture(this.page, "Plan_Details");
        // await CaptureAmounts.getValues(this.page);
        await this.nextBtn.click();


    }

}