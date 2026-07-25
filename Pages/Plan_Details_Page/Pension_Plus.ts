import { Page, Locator } from '@playwright/test';
import { ScreenshotUtil } from '../../utils/screenshotUtil';
import { getData } from '../../utils/readExcelUtil';
import { DropdownActions } from '../../utils/dropdownsUtil';
import { addFund} from '../../utils/addFundUtil';
import { riderDetails } from '../../utils/ridersUtil';

export class PensionPlus {

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
        await dropdown.selectAntDropdown('PremFreqmode', data.Frequency);

        // Get Age
        const ageStr = await this.age.inputValue();
        const ageInt = parseInt(ageStr);

        if (ageInt >= 18 && ageInt <= 65) {
            await dropdown.selectDropdownValue('Policy Term', data.PT);
            await dropdown.selectDropdownValue('Premium Term', data.PPT);
        }

        // Enter Premium
        await this.premiumInput.fill(data.Premium);

        await ScreenshotUtil.capture(this.page, "Plan_Details");

        const Fund = new addFund(this.page);
        Fund.selectFund(testcaseID);

        // Negative Scenario
        if (data.TestCase_Type?.toString().toLowerCase() === "negative") {

            // You can call validation helper
            // await this.validateError(data['Expected_Result']);
            // return;
        }

        await this.calculateBtn.click();

        await this.page.waitForLoadState('load');

        const rider = new riderDetails(this.page);
        await rider.fillRiderDetails(testcaseID);

        await this.calculateBtn.click();

        await this.page.waitForLoadState('networkidle');

        await this.page.waitForTimeout(2000);

        await this.nextBtn.scrollIntoViewIfNeeded();

        await ScreenshotUtil.capture(this.page, "Plan_Details");

        await this.nextBtn.click();

    }

}