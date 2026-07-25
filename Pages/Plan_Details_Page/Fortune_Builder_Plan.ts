import { Page, Locator } from '@playwright/test';
import { ScreenshotUtil } from '../../utils/screenshotUtil';
import { getData } from '../../utils/readExcelUtil';
import { DropdownActions } from '../../utils/dropdownsUtil';
import { addFund} from '../../utils/addFundUtil';
import { handleBI } from '../../utils/downloadBIUtil';
import { validationCases } from '../../utils/validationCasesUtil';
import { riderDetails } from '../../utils/ridersUtil';

export class FortuneBuilder {

    readonly page: Page;

    // Locators
    readonly productName: (planName: string) => Locator;
    readonly age: Locator;
    readonly premiumInput: Locator;
    readonly SAInput: Locator;
    readonly calculateBtn: Locator;
    readonly atoOptionUlip: Locator;
    readonly nextBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        this.productName = (planName: string) =>
        page.locator(`//h6[contains(normalize-space(.), '${planName}')]`);

        this.age = page.locator("//input[@name='Age']");
        this.premiumInput = page.locator("//input[@name='PremiumContribtuion']");
        this.SAInput = page.locator("//input[@name='SumAssured']");
        this.calculateBtn = page.locator("//button[@id='Newplan_Cal']");
        this.atoOptionUlip = page.locator("(//button[@role='switch'])[1]");
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
       
        await dropdown.selectAntDropdown('PremFreqmode', data.Frequency);

        // Get Age
        const ageStr = await this.age.inputValue();
        const ageInt = parseInt(ageStr);

        if (ageInt <= 65) {
            await dropdown.selectPlanPageDropdown('Policy Term', data.PT);
            await dropdown.selectPlanPageDropdown('Premium Term', data.PPT);
        }

        // Enter Premium
        await this.premiumInput.fill(data.Premium);
        await this.SAInput.fill(data.Sum_Assured);

        await ScreenshotUtil.capture(this.page, "Plan_Details");

        if (data.ATO_Option?.toString().toLowerCase() === "yes"){
            await this.atoOptionUlip.click()
			await dropdown.selectAntDropdown('ATOPeriodMonths', data.ATO_Period)
			await dropdown.selectAntDropdown('SourceFund', 'Preserver')
        }

        const Fund = new addFund(this.page);
        Fund.selectFund(testcaseID);

        // Negative Scenario
        if (data.TestCase_Type?.toString().toLowerCase() === "negative") {

            const validate = new validationCases(this.page);
            await validate.validatePlanDetails(testcaseID, data.Expected_Result);
            return;
        }

        await this.calculateBtn.click();

        await this.page.waitForLoadState('load');
        
        //fillRiderDetails()
        const rider = new riderDetails(this.page);
        await rider.fillRiderDetails(testcaseID);


        await this.calculateBtn.click();

        await this.page.waitForLoadState('networkidle');

        await this.page.waitForTimeout(2000);

        await this.nextBtn.scrollIntoViewIfNeeded();

        await ScreenshotUtil.capture(this.page, "Plan_Details");

        await this.nextBtn.click();

        await handleBI(this.page, data.BI_Required);

    }

}