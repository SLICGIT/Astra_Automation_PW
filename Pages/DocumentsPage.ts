import { Page, Locator } from '@playwright/test';
import { getData } from '../utils/readExcelUtil';
import { DropdownActions } from '../utils/dropdownsUtil';
import { ScreenshotUtil } from '../utils/screenshotUtil';
import { GlobalConfig } from '../config/globalConfig';


export class documentsPage{

    readonly page:Page;
    // readonly documentsUploadText:Locator;
    readonly uploadPropIDProof:Locator;
    readonly uploadPropAddressProof:Locator;
    readonly uploadPropAgeProof: Locator;
    readonly uploadPropIncomeProof: Locator;
    readonly uploadLAAgeProof:Locator;
    readonly uploadLAIDproof:Locator;
    readonly uploadLAddressProof:Locator;
    readonly uploadDeclaration:Locator;
    readonly uploadIncomeProof:Locator;
    readonly LAPANNo:Locator;
    readonly LAIDProofInput:Locator;
    readonly LAAddressProofIDInput:Locator;
    readonly nextBtn:Locator;



    constructor(page:Page,TC_ID: string){

        this.page = page;
        // this.documentsUploadText = page.locator("xpath=");
        this.uploadPropIDProof = page.locator("xpath=//span[text()='Proposer ID Proof Upload']/ancestor::div[contains(@class,'ant-upload-select')]//input[@type='file']");
        this.uploadPropAddressProof = page.locator("xpath=//span[text()='Proposer Address Proof Upload']/ancestor::div[contains(@class,'ant-upload-select')]//input[@type='file']");
        this.uploadPropAgeProof = page.locator("xpath=//span[text()='Proposer Age Proof Upload']/ancestor::div[contains(@class,'ant-upload-select')]//input[@type='file']");
        this.uploadPropIncomeProof = page.locator("xpath=//span[text()='Proposer Income Proof Upload']/ancestor::div[contains(@class,'ant-upload-select')]//input[@type='file']");
        this.uploadLAAgeProof = page.locator("xpath=//span[text()='LA Age Proof Upload']/ancestor::div[contains(@class,'ant-upload-select')]//input[@type='file']");
        this.uploadIncomeProof = page.locator("xpath=//span[text()='LA Income Proof Upload']/ancestor::div[contains(@class,'ant-upload-select')]//input[@type='file']");
        this.uploadLAddressProof = page.locator("xpath=//span[text()='LA Address Proof Upload']/ancestor::div[contains(@class,'ant-upload-select')]//input[@type='file']");
        this.uploadLAIDproof = page.locator("xpath=//span[text()='LA ID Proof Upload']/ancestor::div[contains(@class,'ant-upload-select')]//input[@type='file']");
        this.uploadDeclaration = page.locator("xpath=//span[text()='Declaration Photo Copy']/ancestor::div[contains(@class,'ant-upload-select')]//input[@type='file']");
        this.LAPANNo = page.locator("xpath=//input[@name='PANNum']");
        this.LAIDProofInput = page.locator("xpath=//input[@name='ID4']");
        this.LAAddressProofIDInput = page.locator("xpath=//input[@name='AddressProof_AADHAR']");
        this.nextBtn = page.locator("xpath=//button[@type='submit']//span[normalize-space(text())='Next']");
    }
    async fillDocumentPage(lifetype:string,TC_ID: string){

        const data = getData('Documents_Page',TC_ID);
        const dropdown = new DropdownActions(this.page);
        //await this.page.pause();

        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        if (lifetype == 'Other Life') {

            await this.page.locator("[name='PropoIDProf']").waitFor({state: 'visible'});
            
			await dropdown.selectAntDropdown('PropoIDProf', data.Prop_IDProof);
            await this.uploadPropIDProof.setInputFiles(data.Prop_IDProof_Doc);
            await this.page.waitForLoadState('networkidle');
        	await dropdown.selectAntDropdown('PropoAddProf', data.Prop_AddressProof);
            await this.uploadPropAddressProof.setInputFiles(data.Prop_AddressProof_Doc);
            await this.page.waitForLoadState('networkidle');

            // Proposer Age Proof Upload
            await dropdown.selectAntDropdown('ProAgePRDoc', data.Prop_AgeProof);
            await this.uploadPropAgeProof.setInputFiles(data.Prop_AgeProof_Doc);
            await this.page.waitForLoadState('networkidle');

            // Proposer Income Proof Upload
            await dropdown.selectAntDropdown('ProIncoPRDoc', data.Prop_IncomeProof);
            await this.uploadPropIncomeProof.setInputFiles(data.Prop_IncomeProof_Doc);
            await this.page.waitForLoadState('networkidle');

        }
        await this.page.waitForTimeout(3000);
        // await dropdown.selectAntDropdown('AgePRDoc', data.LA_AgeProof);

        if(data['LA_AgeProof'] == 'PAN Card - Standard') {

            await this.LAPANNo.fill(data.LA_AgeProof_Number);
        }

        await this.uploadLAAgeProof.setInputFiles(data.LA_AgeProof_Doc);
        await this.page.waitForLoadState('networkidle');
                
    	await dropdown.selectAntDropdown('IDPRDoc', data.LA_IDProof);
        await this.LAIDProofInput.fill(data.LA_IDProof_Number);
        await this.uploadLAIDproof.setInputFiles(data.LA_IDProof_Doc);
        await this.page.waitForLoadState('networkidle');

        await this.page.waitForTimeout(1000);
    	await dropdown.selectAntDropdown('AddPRDoc', data.LA_AddressProof);
        await this.LAAddressProofIDInput.fill(data.LA_AddressProof_Number);
        await this.uploadLAddressProof.setInputFiles(data.LA_AddressProof_Doc);
        await this.page.waitForLoadState('networkidle');
        
        await this.page.waitForTimeout(1000);
        await this.uploadDeclaration.setInputFiles(data.LA_Declaration_Doc);
        await this.page.waitForLoadState('networkidle');

        await this.page.waitForTimeout(1000);
		await dropdown.selectAntDropdown('IncoPRDoc', data.LA_IncomeProof);
        await this.uploadIncomeProof.setInputFiles(data.LA_IncomeProof_Doc);
        await this.page.waitForLoadState('load');

        await this.page.waitForTimeout(2000);
        await this.nextBtn.waitFor({state: 'visible'});
        await this.nextBtn.click();
        GlobalConfig.actualResultSteps += " | Document Uploaded Successfully";
        console.log("Document Uploaded Successfully");



        
    }
}