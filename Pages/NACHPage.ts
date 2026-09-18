import { Page, Locator } from '@playwright/test';
import { getData } from '../utils/readExcelUtil';
import { DropdownActions } from '../utils/dropdownsUtil';

import { ScreenshotUtil } from '../utils/screenshotUtil';
import { GenerateName } from '../utils/generateNameUtil';
import { GlobalConfig } from '../config/globalConfig';



export class NACHRegistrationPAge{
    readonly page:Page;
    readonly enterManuallyBtn:Locator;
    readonly MNACHConfirmBtn:Locator;
    readonly AccHolderName:Locator;
    readonly accountNo:Locator;
    readonly reAccountNo:Locator;
    readonly IFSCCode:Locator;
    readonly IFSCSearch:Locator;
    readonly MICRCOde:Locator;
    readonly uploadNACHForm:Locator;
    readonly uploadNACHBankProof:Locator;
    readonly nextBtn:Locator;
    readonly confirmVerifyBtn:Locator;
    readonly confirmContinueBtn:Locator;
    readonly bankFetchedTxt:Locator;
    readonly summaryNextBtn:Locator;
    

    constructor(page:Page,TC_ID: string){
        this.page = page;

        this.enterManuallyBtn = page.locator("xpath=//div/span[text()='Enter Manually']"); //new added
        this.MNACHConfirmBtn =page.locator("xpath=//button/span[text()='Yes']");
        this.AccHolderName = page.locator("xpath=//input[@name='NAccountHoldName']"); //good
        this.accountNo = page.locator("xpath=//input[@name='NEnterAccountnum']"); //good
        this.reAccountNo = page.locator("xpath=//input[@name='NreEnterAccountnum']"); //good
        this.IFSCCode = page.locator("xpath=//input[@name='Nifsccode']"); //good
        this.IFSCSearch = page.locator("xpath=//input[@name='Nifsccode']/following-sibling::div/span"); //good
        // this.sameBankBtn = page.locator("xpth=//span[text()='${Same_Bank}']");
       this.MICRCOde = page.locator("xpath=//input[@name='NMICRCodeMN']");
        this.uploadNACHForm = page.locator("xpath=//span[text()='Upload NACH Form']/ancestor::div[contains(@class,'ant-upload-select')]//input[@type='file']");
        this.uploadNACHBankProof = page.locator("xpath=//span[text()='Upload NACH Bank Proof']/ancestor::div[contains(@class,'ant-upload-select')]//input[@type='file']");
        this.nextBtn = page.locator("//span[text()='Next']"); // good
        this.confirmVerifyBtn = page.locator("xpath=//button/span[text()='Confirm & Verify']"); //new Added
        this.confirmContinueBtn = page.locator("xpath=//button/span[text()='Confirm & Continue']");
        this.bankFetchedTxt = page.locator("xpath=//div/span/div[text()='✓ Bank details fetched']");
        this.summaryNextBtn = page.locator("xpath=//button[text()='Next']");
        

    }
    async fillNACHPage(TC_ID:string){

        const data = getData('NACH_Page', TC_ID);
        const dropdown = new DropdownActions(this.page);
        //await this.page.pause();

        await this.page.waitForLoadState('networkidle');

		await dropdown.selectAntDropdown('NachRegdr',data.NACH_Registration);

        await this.page.waitForLoadState('networkidle');
        await this.MNACHConfirmBtn.waitFor({state:'visible'});
        await this.MNACHConfirmBtn.click();
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(1000);

        await this.uploadNACHBankProof.setInputFiles(data.Front_Picture); // need to edit Test Data
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        await this.uploadNACHForm.setInputFiles(data.Back_Picture); // need to edit Test Data
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(5000);

        if(await this.bankFetchedTxt.isVisible()){
            await this.MICRCOde.fill('123456789');

        }else{
            await this.enterManuallyBtn.click();
            await this.AccHolderName.fill(GenerateName.getName());

            await this.accountNo.fill(data.Account_Number);
            await this.reAccountNo.fill(data.Account_Number);
            await this.IFSCCode.fill(data.IFSC_Code);
            await this.IFSCSearch.click();
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForTimeout(2000);
                
        }
        await dropdown.selectAntDropdown('AccountType', data.Account_Type);
		await dropdown.selectAntDropdown('Perferedtype', data.Debit_Date);
        await this.nextBtn.click();
        await this.page.waitForLoadState('networkidle');
        await this.confirmVerifyBtn.waitFor({state:'visible'});
        await this.confirmVerifyBtn.click();

        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(3000);
        await this.confirmContinueBtn.waitFor({state:'visible'});
        await this.confirmContinueBtn.click();


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