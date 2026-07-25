import { Page, Locator } from '@playwright/test';
import { ScreenshotUtil } from '../../utils/screenshotUtil';
import { getData } from '../../utils/readExcelUtil';
import { DropdownActions } from '../../utils/dropdownsUtil';
import { handleBI } from '../../utils/downloadBIUtil';
import { validationCases } from '../../utils/validationCasesUtil';
import { riderDetails } from '../../utils/ridersUtil';

export class ASP {

    readonly page: Page;

    // Locators
    readonly productName: (planName: string) => Locator;
    readonly age: Locator;
    readonly premiumInput: Locator;
    readonly calculateBtn: Locator;
    readonly stepRiderCheckbox: Locator;
    readonly nextBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        this.productName = (planName: string) =>
        page.locator(`//h6[contains(normalize-space(.), '${planName}')]`);

        this.age = page.locator("//input[@name='Age']");
        this.premiumInput = page.locator("//input[@name='PremiumContribtuion']");
        this.calculateBtn = page.locator("//button[@id='Newplan_Cal']");
        this.stepRiderCheckbox = page.locator("(//label[contains(text(),'Step Up Rider')]/parent::div/label/span/input)[1]");
        this.nextBtn = page.locator("//span[normalize-space(text())='Next']");
    }

    // Single method (as requested)
    async fillPlanDetails(testcaseID: string) {

        const data = getData('Plan_Details_Page', testcaseID);
        const dropdown = new DropdownActions(this.page)

        await this.page.waitForLoadState('networkidle');

        // Select Product
        await this.productName(data["Plan_Name"]).waitFor({state: 'visible'});
        await this.productName(data["Plan_Name"]).click();

        await this.page.waitForLoadState('networkidle');

        // Dropdown selections
        await dropdown.selectAntDropdown('AgeProofType', data.LA_Age_Proof);
        await dropdown.selectAntDropdown('Option', data.Life_Cover);
        await dropdown.selectAntDropdown('MaturityBenfit', data.Maturity_Benefit);
        await dropdown.selectAntDropdown('Deathbenefit', data.Death_Benefit);
        await dropdown.selectAntDropdown('PremFreqmode', data.Frequency);

        // Get Age
        const ageStr = await this.age.inputValue();
        const ageInt = parseInt(ageStr);

        if (ageInt >= 3 && ageInt <= 55) {
            await dropdown.selectAntDropdown('PolicyTerm', data.PT);
            await dropdown.selectAntDropdown('PermiumTerm', data.PPT);
        }

        // Enter Premium
        await this.premiumInput.fill(data.Premium);

        await ScreenshotUtil.capture(this.page, "Plan_Details");

        // Negative Scenario
        if (data.TestCase_Type?.toString().toLowerCase() === "negative") {

            const validate = new validationCases(this.page);
            await validate.validatePlanDetails(testcaseID, data.Expected_Result);
            return;
        }

        await this.calculateBtn.click();

        // Riders
        if (!data.Plan_Name.toString().includes('POS')) {

            await this.page.waitForLoadState('networkidle');
            await this.stepRiderCheckbox.waitFor({ state: 'visible', timeout: 5000 });
            await this.page.waitForTimeout(500);
            await this.stepRiderCheckbox.click();

            const rider = new riderDetails(this.page);
            await rider.fillRiderDetails(testcaseID);
        }

        await this.calculateBtn.click();

        await this.page.waitForLoadState('networkidle')

        await this.page.waitForTimeout(2000);

        await this.nextBtn.scrollIntoViewIfNeeded();

        await ScreenshotUtil.capture(this.page, "Plan_Details");

        // await CaptureAmounts.getValues(this.page);

        await this.nextBtn.click();

        await handleBI(this.page, data.BI_Required);
    }

}