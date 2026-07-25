import { Page, Locator } from '@playwright/test';
import { getData } from '../utils/readExcelUtil';
import { DropdownActions } from '../utils/dropdownsUtil';

import { ScreenshotUtil } from '../utils/screenshotUtil';
import { convertAge } from '../utils/convertAgeUtil';
import { GenerateName } from '../utils/generateNameUtil';
import { GlobalConfig } from '../config/globalConfig';



export class nomineePage{

    //  Nominee Details
    readonly page : Page;
    readonly nomineeFirsrName : Locator;
    readonly nomineeMiddleName: Locator;
    readonly nomineeLastName: Locator;
    readonly nomineeDOB: Locator;
    readonly nomineeAge: Locator;
    // readonly nomineeGender: Locator;
    readonly nomineeShare: Locator;
    readonly nomineeMobileNumber: Locator;
    readonly nomineeAccountNo: Locator;
    readonly nomineeIFSCCode: Locator;
    readonly nomineeAddressToggle: Locator;
    readonly addNomineeBtn: Locator;
    readonly nextBtn: Locator;


    constructor(page:Page,TC_ID:string ){

        this.page = page;
        this.nomineeFirsrName = page.locator("xpath=//input[@name='FirstName']");
        this.nomineeMiddleName= page.locator("xpath=//input[@name='MiddleName']");
        this.nomineeLastName = page.locator("xpath=//input[@name='LastName']");
        this.nomineeDOB = page.locator("xpath=//input[@name='DOB']");
        this.nomineeAge = page.locator("xpath=//input[@name='Age']");
        // this.nomineeGender = page.locator(`xpath=//button[text()='${Gender}']`);
        // this.relationWithLA = page.locator("")
        this.nomineeShare = page.locator("xpath=//input[@name='NomineeShare']");
        this.nomineeMobileNumber = page.locator("xpath=//input[@name='MobileNo']");
        this.nomineeAccountNo = page.locator("xpath=//input[@name='NomineeAcctNumber']");
        this.nomineeIFSCCode = page.locator("xpath=//input[@name='NomineeIFSCCode']");
        this.nomineeAddressToggle = page.locator("xpath=//button[@name='IsSameAsPropAddr']");
        this.addNomineeBtn = page.locator("xpath=//button[normalize-space()='+ Add Nominee']");
        this.nextBtn = page.locator("xpath=//button[normalize-space()='Next']");

    }

    async fillNomineePage(TC_ID: string){

        const data = getData("Nominee_Details_Page",TC_ID)
        
        const dropdown = new DropdownActions(this.page)
        
        const planData = getData("Plan_Details_Page", TC_ID);
        // const homeData = getData("Home_Page", TC_ID)

        let age : number = Number(data.Nominee_Age);
        // const convertage = new convertAge()
        
           
        await this.page.waitForLoadState('load');
        await dropdown.selectAntDropdown('Salutation', data.Nominee_Salutation);
        
        await this.nomineeFirsrName.waitFor({state:'visible'});
        await this.nomineeFirsrName.fill(GenerateName.getName());  //fix
        await this.nomineeLastName.fill(GenerateName.getName());   //fix
        await this.nomineeDOB.fill(convertAge.convertAgeToDOB(data.Nominee_Age));  //Fix 

        await this.page.locator(`xpath=//button[text()='${data.Nominee_Gender}']`).click();

        await dropdown.selectAntDropdown('Relationship', data.Nominee_Relation);

        await this.nomineeShare.fill(data.Nominee_Share);
        await this.nomineeMobileNumber.fill(data.Nominee_MobileNo);
        await this.nomineeAccountNo.fill(data.Nominee_AccountNo);
        await this.nomineeIFSCCode.fill(data.Nominee_IFSC_Code);
        await this.page.waitForLoadState('networkidle');

        await this.nomineeAddressToggle.click();

        await this.page.waitForLoadState('networkidle');

        await this.addNomineeBtn.click();
        await this.page.waitForLoadState('networkidle');

        await this.nextBtn.click();
        GlobalConfig.actualResultSteps += " | Nominee page filled Successfully";
        console.log("Nominee page filled Successfully");



            
        }

}