import { Page, Locator } from '@playwright/test';
import { getData } from '../utils/readExcelUtil';
import { DropdownActions } from '../utils/dropdownsUtil';
import { ScreenshotUtil } from '../utils/screenshotUtil';
import { GlobalConfig } from '../config/globalConfig';


export class paymentPage{

    readonly page:Page;
    readonly submitBtn:Locator;
    readonly chequeNoInput:Locator;
    readonly payBtn:Locator;
    readonly proposalNO:Locator;
    readonly bankBranch:Locator;
    readonly doneBtn:Locator;


    constructor(page:Page,TC_ID: string){
        this.page = page;
        this.submitBtn = page.locator("xpath=//button[text()='Submit']");
        this.chequeNoInput = page.locator("xpath=//span[text()='Cheque/DD No']/parent::label/parent::div/input");
        this.payBtn = page.locator("xpath=//button[text()='Pay']");
        this.proposalNO = page.locator("xpath=//label[contains(text(), 'Proposal Number')]");
        this.bankBranch = page.locator("xpath=//span[text()='Bank Branch']/parent::label/parent::div/input");
        this.doneBtn = page.locator("xpath=//button[text()='Done']");
    }

    async fillPaymentPage(TC_ID: string, planName: string){

        const data = getData("Payment_Page",TC_ID)
        const dropdown = new DropdownActions(this.page)
        
        await this.page.waitForLoadState('networkidle');

        if(!planName.toLowerCase().startsWith("tulip combi")) {
            await this.submitBtn.waitFor({state:'visible'});
            await this.page.locator(`xpath=//span[text()='${data.Payment_Option}']`).click();
            await this.submitBtn.click();
        }

        await this.page.waitForLoadState('networkidle');
        await this.page.locator(`//label[text()='${data.Payment_Type}']`).waitFor({state:'visible'});
        await this.page.locator(`//label[text()='${data.Payment_Type}']`).click();
        await this.page.waitForLoadState('networkidle');
        await this.chequeNoInput.waitFor({state:'visible'});
        await this.page.locator(`xpath=//span[text()='${data.Instrument_Type}']`).click();
        await this.chequeNoInput.fill(data.Cheque_Number);
        await dropdown.selectDropdownValueByLabel('Bank Name', data.Bank_Name);
        // need to fix the above Dropdown
        await this.bankBranch.fill(data.Bank_Branch);
        //await this.page.pause();
        await dropdown.selectDropdownValueByLabel('Deposit Bank', data['Deposit Bank']);
        // Need to fix 
        await this.payBtn.click();
        await this.page.waitForLoadState('networkidle');

        const error = await this.page.locator('body').innerText().then(text => text.toLowerCase().includes('credit limit'));
        
        // need to fix the below if block
        if (error) {
        
            await this.page.screenshot({ path: 'Payment_Failure.png', fullPage: true });
            console.log("Payment Failed due to Credit Limit Issue");
            throw new Error('Payment Failed');

        } else {

            await this.page.waitForLoadState('networkidle');
            await this.submitBtn.click();
            await this.page.waitForLoadState('networkidle');
            await this.proposalNO.waitFor({state:'visible'});
            await this.page.waitForTimeout(1000);
            await ScreenshotUtil.capture(this.page,'Proposal_No');
            const text = await this.proposalNO.innerText();
            GlobalConfig.proposalNo = text.substring(18);
            
            console.log("Proposal No:",GlobalConfig.proposalNo);
            GlobalConfig.actualResultSteps += " | Proposal Created Successfully";
            console.log("Proposal Created Successfully");
            await this.doneBtn.click();

        }

    }
    
}