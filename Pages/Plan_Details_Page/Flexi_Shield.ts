import { Page, Locator } from '@playwright/test';
import { ScreenshotUtil } from '../../utils/screenshotUtil';
import { getData } from '../../utils/readExcelUtil';
import { DropdownActions } from '../../utils/dropdownsUtil';
import { handleBI } from '../../utils/downloadBIUtil';
import { validationCases } from '../../utils/validationCasesUtil';
import { riderDetails } from '../../utils/ridersUtil';

export class flexiShield {

    readonly page: Page;

    // Locators
    readonly productName: (planName: string) => Locator;
    readonly age: Locator;
    readonly sumAssured: Locator;
    readonly calculateBtn: Locator;
    readonly stepRiderCheckbox: Locator;
    readonly nextBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        this.productName = (planName: string) =>
        page.locator(`//h6[(normalize-space(.)='${planName}')]`);

        this.age = page.locator("//input[@name='Age']");
        this.sumAssured = page.locator("//input[@name='SumAssured']");
        this.calculateBtn = page.locator("//button[@id='Newplan_Cal']");
        this.stepRiderCheckbox = page.locator("(//label[contains(text(),'Step Up Rider')]/parent::div/label/span/input)[1]");
        this.nextBtn = page.locator("//span[normalize-space(text())='Next']");
    }

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

        if(data.Life_Cover === 'Shield') {
            await dropdown.selectAntDropdown('suboption', data.Sub_Life_Cover);
        }
        await dropdown.selectAntDropdown('Deathbenefit', data.Death_Benefit);

        if(data.Sub_Life_Cover === 'Level Cover') {
            await dropdown.selectAntDropdown('DeathLifeGoal', data.Death_Life_Goal);
        }

        if(data.Death_Benefit.includes('Increasing') || data.Death_Benefit.includes('Decreasing') || data.Death_Benefit.includes('Life Stage Shield')) {
            await dropdown.selectAntDropdown('DeathIncreamentType', data.Death_Incr_Type);
            await dropdown.selectAntDropdown('Death_IncValue', data.Death_Incr_Value);
            
            if(data.Death_Benefit.includes('Decreasing')) {
                await dropdown.selectAntDropdown('DeathRetirementAgeList', data.Death_Retire_Age);
            }
        }
        
        await dropdown.selectAntDropdown('PremFreqmode', data.Frequency);

        // Get Age
        const ageStr = await this.age.inputValue();
        const ageInt = parseInt(ageStr);

        if ((data.Life_Cover === 'Shield' && ageInt <= 65) || (data.Life_Cover === 'Life Stage Shield' && ageInt <= 45) || (data.Life_Cover === 'Smart Shield' && ageInt <= 65)) {
            await dropdown.selectAntDropdown('PolicyTermSlab', data['Policy_Term_Slab']);

            let PT: string = (100 - ageInt).toString();

            if(data.Policy_Term_Slab === 'Whole Life') {
                await dropdown.selectAntDropdown('PolicyTerm', PT);
            } else {
                await dropdown.selectAntDropdown('PolicyTerm', data.PT)
            }

            await dropdown.selectAntDropdown('PremiumTermSlab', data['Premium_Term_Slab'])

            await dropdown.selectAntDropdown('PolicyTerm', data.PT);
            await dropdown.selectAntDropdown('PermiumTerm', data.PPT);

            if(data.Premium_Term_Slab.includes('Whole Life Regular')) {
                await dropdown.selectAntDropdown('PermiumTerm', PT);
            } else {
                await dropdown.selectAntDropdown('PermiumTerm', data['PPT']);
            }
        }

        // Enter Premium
        await this.sumAssured.fill(data.Sum_Assured);

        await ScreenshotUtil.capture(this.page, "Plan_Details");

        // Negative Scenario
        if (data.TestCase_Type?.toString().toLowerCase() === "negative") {

            const validate = new validationCases(this.page);
            await validate.validatePlanDetails(testcaseID, data.Expected_Result);
            return;
        }

        await this.calculateBtn.click();

        await this.stepRiderCheckbox.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(500);
        await this.stepRiderCheckbox.click();

        const rider = new riderDetails(this.page);
        await rider.fillRiderDetails(testcaseID);

        await this.calculateBtn.click();

        await this.page.waitForLoadState('networkidle');

        await this.page.waitForTimeout(2000);

        await this.nextBtn.scrollIntoViewIfNeeded();

        await ScreenshotUtil.capture(this.page, "Plan_Details");

        // await CaptureAmounts.getValues(this.page);

        await this.nextBtn.click();

        await handleBI(this.page, data.BI_Required);
    }

}