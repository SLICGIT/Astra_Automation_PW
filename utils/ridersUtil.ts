import { Page, Locator } from '@playwright/test';
import { getData } from './readExcelUtil';
import { ScreenshotUtil } from './screenshotUtil';
import { DropdownActions } from './dropdownsUtil';

export class riderDetails {
    readonly page: Page;
    
    readonly ADD_RiderCheckbox: Locator;
    readonly CIC_RiderCheckbox: Locator;
    readonly ADDI_RiderCheckbox: Locator;
    readonly AB_RiderCheckbox: Locator;
    readonly FIB_RiderCheckbox: Locator;
    readonly EIC_RiderCheckbox: Locator;
    readonly CIW_RiderCheckbox: Locator;
    readonly CIWCare_RiderCheckbox: Locator;
    readonly CIWMat_RiderCheckbox: Locator;
    readonly CIP_RiderCheckbox: Locator;
    readonly Step_RiderCheckbox: Locator;
    readonly riderEditButton: Locator;
    readonly riderSA: Locator;
    readonly riderSaveButton: Locator;
    readonly riderCloseButton: Locator;
    readonly MatRiderEditButton: Locator;
    readonly MatRiderSA: Locator;
    readonly MatRiderSaveButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.ADD_RiderCheckbox = page.locator("(//label[contains(text(),'ACCIDENTAL DEATH')]/parent::div/label/span/input)[1]");
        this.CIC_RiderCheckbox = page.locator("(//label[contains(text(),'CRITICAL ILLNESS')]/parent::div/label/span/input)[1]");
        this.ADDI_RiderCheckbox = page.locator("(//label[contains(text(),'INCOME RIDER')]/parent::div/label/span/input)[1]");
        this.AB_RiderCheckbox = page.locator("(//label[contains(text(),'Accident Benefit Rider')]/parent::div/label/span/input)[1]");
        this.FIB_RiderCheckbox = page.locator("(//label[contains(text(),'Family Income Benefit')]/parent::div/label/span/input)[1]");
        this.EIC_RiderCheckbox = page.locator("(//label[contains(text(),'Extra Insurance Cover')]/parent::div/label/span/input)[1]");
        this.CIW_RiderCheckbox = page.locator("(//label[contains(text(),'Critical Illness Woman')]/parent::div/label/span/input)[1]");
        this.CIWCare_RiderCheckbox = page.locator("(//div[contains(@class, 'ant-modal-mask')]/following::input[@type='checkbox'])[1]");
        this.CIWMat_RiderCheckbox = page.locator("(//div[contains(@class, 'ant-modal-mask')]/following::input[@type='checkbox'])[2]");
        this.CIP_RiderCheckbox = page.locator("(//label[contains(text(),'Critical Illness Plus')]/parent::div/label/span/input)[1]");
        this.Step_RiderCheckbox = page.locator("(//label[contains(text(),'Step Up Rider')]/parent::div/label/span/input)[1]");

        this.riderEditButton = page.locator("//div[contains(@class, 'ant-modal-mask')]/following::div[@class='RiderSaveBtn'][1]/img");
        this.riderSA = page.locator("//div[contains(@class, 'ant-modal-mask')]/following::input[@name='SumAssured'][1]");
        this.riderSaveButton = page.locator("//div[contains(@class, 'ant-modal-mask')]/following::span[text()='Save'][1]");
        this.riderCloseButton = page.locator("//div[@class='RiderModal_Hdr']/img");

        this.MatRiderEditButton = page.locator("//div[contains(@class, 'ant-modal-mask')]/following::div[@class='RiderSaveBtn'][2]/img");
        this.MatRiderSA = page.locator("//div[contains(@class, 'ant-modal-mask')]/following::input[@name='SumAssured'][2]");
        this.MatRiderSaveButton = page.locator("//div[contains(@class, 'ant-modal-mask')]/following::span[text()='Save'][2]");
    }

    async fillRiderDetails(TC_ID: string) {

        const data = getData("Plan_Details_Page", TC_ID);
        const dropdown = new DropdownActions(this.page)

        // Fill ADD Rider Details (ULIP Rider)
        if (data['ADD_Rider']?.toString().toLowerCase() === 'yes') {

            await this.ADD_RiderCheckbox.click();
            await this.riderDetails(data['ADD_PT'], data['ADD_PPT'], data['ADD_SA']);

        }

        // Fill CIC Rider Details (ULIP Rider)
        if (data['CIC_Rider']?.toString().toLowerCase() === 'yes') {

            await this.CIC_RiderCheckbox.click();
            await this.riderDetails(data['CIC_PT'], data['CIC_PPT'], data['CIC_SA']);

        }

        // Fill ADDI Rider Details (ULIP Rider)
        if (data['ADDI_Rider']?.toString().toLowerCase() === 'yes') {

            await this.ADDI_RiderCheckbox.click();
            await this.riderDetails(data['ADDI_PT'], data['ADDI_PPT'], data['ADDI_SA']);

        }

        // Fill AB Rider Details
        if (data['AB_Rider']?.toString().toLowerCase() === 'yes') {

            await this.AB_RiderCheckbox.click();
            await this.riderDetails(data['AB_PT'], data['AB_PPT'], data['AB_SA']);

        }

        // Fill FIB Rider Details
        if (data['FIB_Rider']?.toString().toLowerCase() === 'yes') {

            await this.FIB_RiderCheckbox.click();
            await this.riderDetails(data['FIB_PT'], data['FIB_PPT'], data['FIB_SA']);

        }

        // Fill EIC Rider Details
        if (data['EIC_Rider']?.toString().toLowerCase() === 'yes') {

            await this.EIC_RiderCheckbox.click();
            await this.riderDetails(data['EIC_PT'], data['EIC_PPT'], data['EIC_SA']);

        }

        // Fill CIP Rider Details
        if (data['CIP_Rider']?.toString().toLowerCase() === 'yes') {

            await this.CIP_RiderCheckbox.click();
            await this.riderDetails(data['CIP_PT'], data['CIP_PPT'], data['CIP_SA']);

        }

        // Fill Step Rider Details
        if (data['Step_Rider']?.toString().toLowerCase() === 'yes') {

            await this.Step_RiderCheckbox.click();
            await this.stepRiderDetails(data['Step_PT'], data['Step_PPT'], data['Step_SA']);

        }

        // Fill CIW Rider Details
        if (data['CIWCare_Rider']?.toString().toLowerCase() === 'yes' && data['CIW_Mat_Rider']?.toString().toLowerCase() === 'yes') {

            await this.CIW_RiderCheckbox.click();
            await this.riderEditButton.waitFor({state: 'visible'});
            await this.riderEditButton.click();
            await dropdown.selectRiderDropdown("PolicyTerm", data['CIWCare_PT']);
            await dropdown.selectRiderDropdown("PermiumTerm", data['CIWCare_PPT']);
            await this.riderSA.waitFor({state: 'visible'});
            await this.riderSA.fill(data['CIWCare_SA']);
            await this.riderSaveButton.click();
            await ScreenshotUtil.capture(this.page, "Plan_Details_Rider");

            // Maternity Rider
            await this.MatRiderEditButton.click();
            await dropdown.selectMatRiderDropdown("PolicyTerm", data['CIW_Mat_PT']);
            await dropdown.selectMatRiderDropdown("PermiumTerm", data['CIW_Mat_PPT']);
            await this.MatRiderSA.waitFor({state: 'visible'});
            await this.MatRiderSA.fill(data['CIW_Mat_SA']);
            await this.MatRiderSaveButton.click();
            await ScreenshotUtil.capture(this.page, "Plan_Details_Rider");
            await this.riderCloseButton.click();

        } else if (data['CIWCare_Rider']?.toString().toLowerCase() === 'yes') {

            await this.CIW_RiderCheckbox.click();
            await this.CIWMat_RiderCheckbox.waitFor({state: 'visible'});
            await this.CIWMat_RiderCheckbox.click();
            await this.riderDetails(data['CIWCare_PT'], data['CIWCare_PPT'], data['CIWCare_SA']);

        } else if (data['CIW_Mat_Rider']?.toString().toLowerCase() === 'yes') {

            await this.CIW_RiderCheckbox.click();
            await this.CIWCare_RiderCheckbox.waitFor({state: 'visible'});
            await this.CIWCare_RiderCheckbox.click();
            await this.matRiderDetails(data['CIW_Mat_PT'], data['CIW_Mat_PPT'], data['CIW_Mat_SA']);

        }

    }

    async riderDetails(policyTerm: string, premiumTerm: string, sumAssured: string) {

        const dropdown = new DropdownActions(this.page)
        
        await this.riderEditButton.waitFor({state: 'visible'});
        await this.riderEditButton.click();
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(1000); // Equivalent of Wait.addWait()

        await dropdown.selectRiderDropdown("PolicyTerm", policyTerm);
        await dropdown.selectRiderDropdown("PermiumTerm", premiumTerm);
        await this.riderSA.waitFor({state: 'visible'});
        await this.riderSA.fill(sumAssured);
        await this.riderSaveButton.click();
        await ScreenshotUtil.capture(this.page, "Plan_Details_Rider");
        await this.riderCloseButton.click();
    }

    async stepRiderDetails(policyTerm: string, premiumTerm: string, sumAssured: string) {

        const dropdown = new DropdownActions(this.page)
        
        await this.riderEditButton.waitFor({state: 'visible'});
        await this.riderEditButton.click();
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(1000); // Equivalent of Wait.addWait()

        await dropdown.selectRiderDropdown("PolicyTerm", policyTerm);
        await dropdown.selectRiderDropdown("PermiumTerm", premiumTerm);
        await this.riderSA.waitFor({state: 'visible'});
        await dropdown.selectRiderDropdown("RiderPercentage", sumAssured);
        await this.riderSaveButton.click();
        await ScreenshotUtil.capture(this.page, "Plan_Details_Rider");
        await this.riderCloseButton.click();
    }

    async matRiderDetails(policyTerm: string, premiumTerm: string, sumAssured: string) {

        const dropdown = new DropdownActions(this.page)
        
        await this.MatRiderEditButton.waitFor({state: 'visible'});
        await this.MatRiderEditButton.click();
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(1000); // Equivalent of Wait.addWait()

        await dropdown.selectMatRiderDropdown("PolicyTerm", policyTerm);
        await dropdown.selectRiderDropdown("PermiumTerm", premiumTerm);
        await this.riderSA.waitFor({state: 'visible'});
        await this.riderSA.fill(sumAssured);
        await this.MatRiderSaveButton.click();
        await ScreenshotUtil.capture(this.page, "Plan_Details_Rider");
        await this.riderCloseButton.click();
    }

}