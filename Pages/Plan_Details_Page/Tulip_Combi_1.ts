import { Page, Locator } from '@playwright/test';
import { ScreenshotUtil } from '../../utils/screenshotUtil';
import { getData } from '../../utils/readExcelUtil';
import { DropdownActions } from '../../utils/dropdownsUtil';
import { handleBI } from '../../utils/downloadBIUtil';
import { validationCases } from '../../utils/validationCasesUtil';
import { riderDetails } from '../../utils/ridersUtil';
import { addFund } from '../../utils/addFundUtil';

export class TulipCombi1 {

    readonly page: Page;

    // Locators
    readonly productName: (planName: string) => Locator;
    readonly age: Locator;
    readonly premiumInput: Locator;
    readonly nextDetailsBtn: Locator;
    readonly stepRiderCheckbox: Locator;
    readonly nextBtn: Locator;
    readonly atoOptionUlip: Locator;

    readonly VMER_Yes: Locator;
    readonly VMER_No: Locator;
    readonly combiCalculateBtn: Locator;
    readonly totalAmount: Locator;

    readonly flexiRatioInput: Locator
    readonly gjpRatioInput: Locator;

    constructor(page: Page) {
        this.page = page;

        this.productName = (planName: string) =>
        page.locator(`//h6[contains(normalize-space(.), '${planName}')]`);

        this.age = page.locator("//input[@name='Age']");
        this.premiumInput = page.locator("//input[@name='PremiumContribtuion']");
        this.nextDetailsBtn = page.locator("//button[@id='Newplan_Cal']");
        this.stepRiderCheckbox = page.locator("(//label[contains(text(),'Step Up Rider')]/parent::div/label/span/input)[1]");
        this.nextBtn = page.locator("(//span[normalize-space(text())='Next'])[2]");
        this.atoOptionUlip = page.locator("(//button[@role='switch'])[1]");

        this.VMER_Yes = page.locator("//span[text()='YES']/preceding-sibling::span/input[@type='checkbox']");
        this.VMER_No = page.locator("//span[text()='NO']/preceding-sibling::span/input[@type='checkbox']");
        this.combiCalculateBtn = page.locator("(//button[@id='Newplan_Cal'])[2]");
        this.totalAmount = page.locator("//span[text()='Total']");

        this.flexiRatioInput = page.locator("//input[@name='RatioValue_252']");
        this.gjpRatioInput = page.locator("//input[@name='RatioValue_225']");

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

        // Get Age
        const ageStr = await this.age.inputValue();
        const ageInt = parseInt(ageStr);

        // Dropdown selections
        await dropdown.selectAntDropdown('AgeProofType', data.LA_Age_Proof);

        //Enter Flexi Plan Details
        await this.flexiDropdown('Life Cover Option', data.Tulip_Flexi_Life_Cover_Option);
        await dropdown.selectAntDropdown('PlansubOptval.suboption_252', data.Tulip_Flexi_Sub_Option_Cover);
        await this.page.waitForLoadState('load');
        await dropdown.selectAntDropdown('DeathBen_252', data.Tulip_Flexi_Death_Benefit);
        await dropdown.selectAntDropdown('DeathLifeGoal_252', data.Tulip_Flexi_Death_Life_Goal);
        await this.flexiRatioInput.fill('50');

        const saAmount = Number(data['Sum_Assured'].replace(/,/g, ''));

        if(saAmount < 5000000) {
            if(data.Tulip_Flexi_VMER === 'YES') {
                await this.VMER_Yes.click();
            } //else if(data.Tulip_Flexi_VMER === 'NO') {
            //     await this.VMER_No.click();
            // }
        }

        await this.page.waitForTimeout(100);
        await ScreenshotUtil.capture(this.page, "Plan_Details");

        //Enter Golden Jubilee Plan Details
        await this.goldenJubileeDropdown('Life Cover Option', data.Tulip_GJP_Life_Cover_Option);
        await dropdown.selectAntDropdown('PlansubOptval.suboption_225', data.Tulip_GJP_Sub_Option_Cover);
        await this.page.waitForLoadState('load');
        await dropdown.selectAntDropdown('MaturityBenfit_225', data.Tulip_GJP_Maturity_Benefit);
        await this.goldenJubileeDropdown('Death Benefit', data.Tulip_GJP_Death_Benefit);
        await this.gjpRatioInput.fill('50');

        //Fill Fund Details
        if (data.ATO_Option?.toString().toLowerCase() === "yes"){
            await this.atoOptionUlip.click()
			await dropdown.selectAntDropdown('ATOPeriodMonths', data.ATO_Period)
			await dropdown.selectAntDropdown('SourceFund', 'Preserver')
        }

        const Fund = new addFund(this.page);
        await Fund.selectFund(testcaseID);

        await this.page.waitForTimeout(100);
        await ScreenshotUtil.capture(this.page, "Plan_Details");

        await this.nextDetailsBtn.click();
        await this.page.waitForLoadState('load');

        // Enter all plan details like frequency, PT, PPT, Premium and Sum Assured
        await dropdown.selectAntDropdown('PremFreqmode', data.Frequency);
        await dropdown.selectAntDropdown('PolicyTermSlab', data.Policy_Term_Slab);
        await this.page.waitForLoadState('load');

        // Take input from policy term slab and trim age cover value to calculate PT
        const ptCover = Number(data['Policy_Term_Slab'].match(/\d+/)?.[0]);
        const pt = ptCover - ageInt;
        await dropdown.selectAntDropdown('PolicyTerm', String(pt));

        await dropdown.selectAntDropdown('PremiumTermSlab', data.Premium_Term_Slab);
        await this.page.waitForLoadState('load');
        await dropdown.selectAntDropdown('PermiumTerm', data.PPT);

        await this.premiumInput.fill(data.Premium);
        await dropdown.selectAntDropdown('SumAssured', data.Sum_Assured);

        await this.page.waitForTimeout(100);
        await ScreenshotUtil.capture(this.page, "Plan_Details");

        await this.combiCalculateBtn.click();
        await this.page.waitForLoadState('networkidle');

        await this.totalAmount.waitFor({state: 'visible'})
        await this.totalAmount.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000);
        await ScreenshotUtil.capture(this.page, "Plan_Details");

        await this.nextBtn.scrollIntoViewIfNeeded();
        await this.nextBtn.click();
        await this.page.waitForLoadState('networkidle');
        // await handleBI(this.page, data.BI_Required);

    }



    async flexiDropdown(labelText: string, valueToSelect: string) {
       
        const dropdownXpath = `(//label[.//span[normalize-space(text())='${labelText}']]/preceding-sibling::div//div[contains(@class,'ant-select-selector')])[1]`;
 
        const dropdown = this.page.locator(`xpath=${dropdownXpath}`);
 
        // Click dropdown
        await dropdown.waitFor({ state: 'visible' });
        await dropdown.click();
        await this.page.waitForTimeout(500);
 
        // await this.page.waitForTimeout(500); // equivalent of Thread.sleep

        let optionXPath = `(//div[contains(@class,'ant-select-item-option-content') and contains(text(),'${valueToSelect}')])[1]`;
 
        const option1 = this.page.locator(`xpath=${optionXPath}`).first();
 
        if (await option1.isVisible()) {
            await option1.click();
        }

    }

    async goldenJubileeDropdown(labelText: string, valueToSelect: string) {
       
        const dropdownXpath = `(//label[.//span[normalize-space(text())='${labelText}']]/preceding-sibling::div//div[contains(@class,'ant-select-selector')])[2]`;
 
        const dropdown = this.page.locator(`xpath=${dropdownXpath}`);
 
        // Click dropdown
        await dropdown.waitFor({ state: 'visible' });
        await dropdown.click();
        await this.page.waitForTimeout(500);

        try {

            let optionXPath = `(//div[contains(@class,'ant-select-item-option-content') and contains(text(),'${valueToSelect}')])[1]`;
 
            const option1 = this.page.locator(`xpath=${optionXPath}`).first();
 
            if (await option1.isVisible()) {
                await option1.click();
            }

        } catch (e) {
            // ignore
        }
 
        try {

            let optionXPath = `(//div[contains(@class,'ant-select-item-option-content') and contains(text(),'${valueToSelect}')])[2]`;
 
            const option2 = this.page.locator(`xpath=${optionXPath}`).first();
 
            if (await option2.isVisible()) {
                await option2.click();
            }

        } catch (e) {
            // ignore
        }

    }

}