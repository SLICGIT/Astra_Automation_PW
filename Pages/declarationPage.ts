import { Page, Locator } from '@playwright/test';
import { getData } from '../utils/readExcelUtil';
import { DropdownActions } from '../utils/dropdownsUtil';
import { ScreenshotUtil } from '../utils/screenshotUtil';
import { GlobalConfig } from '../config/globalConfig';

export class declarationPage{
         
    readonly page:Page;
    readonly LAPhotoText:Locator;
    readonly uploadLAPhoto:Locator;
    readonly uploadPropPhoto:Locator;
    readonly uploadLASign:Locator;
    readonly uploadPropSign:Locator;
    readonly uploadAgentSign:Locator;
    readonly consentChkBx1:Locator;
    readonly consentChkBx2:Locator;
    readonly consentChkBx3:Locator;
    readonly nextBtn:Locator;
    readonly AgreeBtn:Locator;
    readonly proposerOTPBtn:Locator;
    readonly ConfirmOTPBtn:Locator;
    readonly LAOtpbtn:Locator;
    readonly AgentOtpBtn:Locator;
    readonly smartCardConfirmBtn:Locator;


    constructor(page:Page,TC_ID:string){
        this.page=page;
        this.LAPhotoText = page.locator("xpath=//p[text()='Latest Photograph of Life Assured']");
        this.uploadLAPhoto = page.locator("xpath=//div[contains(@class,'upload-photo')]//input[@id='upload0']");
        this.uploadPropPhoto = page.locator("xpath=//div[contains(@class,'upload-photo')]//input[@id='upload2']");
        this.uploadPropSign = page.locator("xpath= //span[text()='Signature of the Proposer'] /ancestor::div[contains(@class,'ant-upload-select')] //input[@type='file']");
        this.uploadLASign = page.locator("xpath= //span[text()='Signature of the LA'] /ancestor::div[contains(@class,'ant-upload-select')] //input[@type='file']");
        this.uploadAgentSign = page.locator("xpath= //span[text()='Signature of the Agent'] /ancestor::div[contains(@class,'ant-upload-select')] //input[@type='file']");
        this.consentChkBx1 = page.locator("xpath=//span[contains(text(),'Based on details provided under Question related to Details of the life to be assured')]/ancestor::label//input[@type='checkbox']");
        this.consentChkBx2 = page.locator("xpath=//label[.//span[contains(text(),'I have verified the information given in the proposal')]]//input[@type='checkbox']");
        this.consentChkBx3 = page.locator("xpath=//label[.//span[contains(text(),'I hereby give my consent to fetch my bank details')]]//input[@type='checkbox']");
        this.nextBtn = page.locator("xpath=//button[@type='submit']//span[normalize-space(text())='Next']");
        this.AgreeBtn = page.locator("xpath=//button[@type='button']//span[normalize-space(text())='Agree']");
        this.proposerOTPBtn = page.locator("xpath=//button/span[text()='Proposer OTP']");
        this.ConfirmOTPBtn = page.locator("xpath=//span[text()='Confirm']");
        this.LAOtpbtn = page.locator("xpath=//button/span[text()='LA OTP']");
        this.AgentOtpBtn = page.locator("xpath=//button/span[text()='Agent OTP']");
        this.smartCardConfirmBtn = page.locator("xpath=//button[text()='Confirm']");


    }
    async fillDeclarationPage(TC_ID:string, Life_Type:string, proposerType:string){

        const dropdown = new DropdownActions(this.page);
        const ladata = getData("LA_Details_Page",TC_ID);
        const declareData = getData("Declaration_Page",TC_ID);

        await this.page.waitForLoadState('load');
        await this.LAPhotoText.waitFor({state:'visible'});
        await this.uploadLAPhoto.setInputFiles(declareData.LA_Photo);
        await this.page.waitForLoadState('networkidle');

        const lifetype = Life_Type;
        const proposertype = proposerType;

        if(lifetype === 'Other Life'){

            await this.uploadPropPhoto.setInputFiles(declareData.Prop_Photo);
            await this.page.waitForLoadState('networkidle');

            if(proposertype === 'ULIP' || proposertype === 'POS') {

                dropdown.selectAntDropdown('ProposerVerify', 'Proposer OTP');
                await this.proposerOTPBtn.click();
                await this.page.pause();
                await this.ConfirmOTPBtn.click();
                await this.page.waitForLoadState('load');
                await this.page.waitForLoadState('networkidle');
            } else {
                dropdown.selectAntDropdown('ProposerVerify', 'Signature of the Proposer');
                await this.uploadPropSign.setInputFiles(declareData.Prop_Signature)
                await this.page.waitForLoadState('networkidle');
            }
        }
        if(proposertype === 'ULIP' || proposertype === 'POS') {

            if (Number(ladata['LA_Age']) >= 18) {

                dropdown.selectAntDropdown('LAVerify', 'LA OTP');
                await this.LAOtpbtn.click();
                await this.page.pause();
                await this.ConfirmOTPBtn.click();
                await this.page.waitForLoadState('load');
                await this.page.waitForLoadState('networkidle');
            }
        } else{
            dropdown.selectAntDropdown('LAVerify', 'Signature of the LA');
            await this.uploadLASign.setInputFiles(declareData.LA_Signature);
            await this.page.waitForLoadState('networkidle');

        }

        dropdown.selectAntDropdown('AgentVerify', 'Signature of the Agent');
        await this.uploadAgentSign.setInputFiles(declareData.Agent_Signature);
        await this.page.waitForLoadState('networkidle');


        await this.consentChkBx1.check();
        await this.consentChkBx2.check();

        if(await this.consentChkBx3.isVisible({timeout: 3000})) {
            await this.consentChkBx3.check();
        }
        
        await this.nextBtn.click();
        await this.page.waitForLoadState('networkidle');
        await this.AgreeBtn.waitFor({state:'visible'});
        await this.AgreeBtn.click();
        await this.page.waitForLoadState('networkidle');
        if(await this.smartCardConfirmBtn.isVisible({timeout:6000})){
            await this.smartCardConfirmBtn.click();
        }
        GlobalConfig.actualResultSteps += " | Declaration Page Filled Successfully";
        console.log("Declaration Page Filled Successfully");

    }

}