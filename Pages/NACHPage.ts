import { Page, Locator } from '@playwright/test';
import { getData } from '../utils/readExcelUtil';
import { DropdownActions } from '../utils/dropdownsUtil';

import { ScreenshotUtil } from '../utils/screenshotUtil';
import { GenerateName } from '../utils/generateNameUtil';
import { GlobalConfig } from '../config/globalConfig';



export class NACHRegistrationPAge{
    readonly page:Page;
    readonly addNACH:Locator;
    readonly AccHolderName:Locator;
    readonly accountNo:Locator;
    readonly reAccountNo:Locator;
    readonly IFSCCode:Locator;
    readonly IFSCSearch:Locator;
    // readonly sameBankBtn:Locator;
    readonly SaveBtn:Locator;
    readonly OKBtn:Locator;
    readonly uploadPassbookFront:Locator;
    readonly uploadPassbookBack:Locator;
    readonly uploadBankProof:Locator;
    readonly nextBtn:Locator;
    readonly checkBx:Locator;
    readonly confirmBtn:Locator;
    readonly summaryNextBtn:Locator;

    constructor(page:Page,TC_ID: string){
        this.page = page;
        this.addNACH = page.locator("xpath=//span[text()='Add NACH Bank Details']");
        this.AccHolderName = page.locator("xpath=//input[@name='AccountHoldName']");
        this.accountNo = page.locator("xpath=//input[@name='EnterAccountnum']");
        this.reAccountNo = page.locator("xpath=//input[@name='reEnterAccountnum']");
        this.IFSCCode = page.locator("xpath=//input[@name='ifsccode']");
        this.IFSCSearch = page.locator("xpath=//input[@name='ifsccode']/following-sibling::span/span");
        // this.sameBankBtn = page.locator("xpth=//span[text()='${Same_Bank}']");
        this.SaveBtn = page.locator("xpath=//span[text()='Save']");
        this.OKBtn = page.locator("xpath=//span[text()='Ok']");
        this.uploadPassbookFront = page.locator("xpath=//span[text()='NACH form (Front Side)']/ancestor::div[contains(@class,'ant-upload-select')]//input[@type='file']");
        this.uploadPassbookBack = page.locator("xpath=//span[text()='NACH form (Back Side)']/ancestor::div[contains(@class,'ant-upload-select')]//input[@type='file']");
        this.uploadBankProof = page.locator("xpath=//span[text()='Copy of Bank Proof (NACH)']/ancestor::div[contains(@class,'ant-upload-select')]//input[@type='file']");
        this.nextBtn = page.locator("//span[text()='Next']");
        this.checkBx = page.locator("xpath=//input[@type='checkbox']");
        this.confirmBtn = page.locator("xpath=//span[text()='Confirm']");
        this.summaryNextBtn = page.locator("xpath=//button[text()='Next']");
        

    }
    async fillNACHPage(TC_ID:string){

        const data = getData('NACH_Page', TC_ID);
        const dropdown = new DropdownActions(this.page);
        //await this.page.pause();

        await this.page.waitForLoadState('networkidle');

		await dropdown.selectAntDropdown('NachRegdr',data.NACH_Registration);

        await this.page.waitForLoadState('networkidle');
        await this.addNACH.waitFor({state:'visible'});
        await this.page.waitForTimeout(2000);
        await this.addNACH.click();
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('networkidle');

        await this.AccHolderName.fill(GenerateName.getName());

        await this.accountNo.fill(data.Account_Number);
        await this.reAccountNo.fill(data.Account_Number);
        await this.IFSCCode.fill(data.IFSC_Code);
        await this.IFSCSearch.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);


        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('load');
        await dropdown.selectAntDropdown('AccountTypeMN', data.Account_Type);

		await dropdown.selectAntDropdown('PrefDebitDateMN', data.Debit_Date);


        await this.page.locator(`xpath=//span[text()='${data.Same_Bank}']`).click();

        await this.SaveBtn.click();
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('networkidle');

        await this.OKBtn.waitFor({state:'visible'});
        await this.OKBtn.click();

        
        //await this.page.waitForLoadState('load');
        //await this.page.waitForLoadState('networkidle');
        //await this.uploadBankProof.waitFor({ state: 'attached' });
        await this.page.waitForTimeout(2000);
        await this.uploadPassbookFront.setInputFiles(data.Front_Picture);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        await this.uploadPassbookBack.setInputFiles(data.Back_Picture);
        await this.page.waitForLoadState('networkidle');
        await this.uploadBankProof.setInputFiles(data.BankProof_Copy);
        await this.page.waitForLoadState('networkidle');
        await this.nextBtn.click();
        await this.page.waitForLoadState('networkidle');
        await this.checkBx.click();
        await this.confirmBtn.waitFor({state: 'visible'});
        await this.confirmBtn.click();
        console.log("NACH Details Updated Successfully");

        // Summary Page
        await this.page.waitForLoadState('networkidle');
        await this.summaryNextBtn.waitFor({state:'visible'});
        await this.summaryNextBtn.scrollIntoViewIfNeeded();
        await this.summaryNextBtn.click();

        GlobalConfig.actualResultSteps += " | NACH Page Filled Successfully";
         console.log("NACH page filled Successfully");


 
       
    }
}