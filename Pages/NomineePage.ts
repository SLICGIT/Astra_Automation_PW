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


    async addNominee(TC_ID: string) {

        const data = getData("Nominee_Details_Page",TC_ID);

        let nextNomineeShare;
        let totalNomineeShare = 0/*Number(data.Nominee1_Share)*/;
        let Salutation;
        let age;
        let gender;
        let relation;
        let share;
        let mobile;
        let account;
        let ifsc;
        let i = 1;

        do {

            if(i !== 1) {
                await this.addNomineeBtn.waitFor({state: 'visible'});
                await this.addNomineeBtn.click();
            }

            Salutation = `Nominee${i}_Salutation`;
            age = `Nominee${i}_Age`;
            gender = `Nominee${i}_Gender`;
            relation = `Nominee${i}_Relation`;
            share = `Nominee${i}_Share`;
            mobile = `Nominee${i}_MobileNo`;
            account = `Nominee${i}_AccountNo`;
            ifsc = `Nominee${i}_IFSC_Code`;

            await this.fillNomineePage(data[Salutation], data[age], data[gender], data[relation], data[share], data[mobile], data[account], data[ifsc]);

            nextNomineeShare = Number(data[share]);

            totalNomineeShare += nextNomineeShare;
            console.log(`Nominee${i} Share : ${nextNomineeShare}`);
            i++;

        } while (totalNomineeShare < 100)

        await this.nextBtn.waitFor({state: 'visible'});
        await this.nextBtn.click();

        GlobalConfig.actualResultSteps += " | Nominee page filled Successfully";
        console.log("Nominee page filled Successfully");

        // for(let i = 1; totalNomineeShare != 100; i++) {

        //     let Salutation = `Nominee${i}_Salutation`;
        //     let age = `Nominee${i}_Age`;
        //     let gender = `Nominee${i}_Gender`;
        //     let relation = `Nominee${i}_Relation`;
        //     let share = `Nominee${i}_Share`;
        //     let mobile = `Nominee${i}_MobileNo`;
        //     let account = `Nominee${i}_AccountNo`;
        //     let ifsc = `Nominee${i}_IFSC_Code`;

        //     // await this.fillNomineePage();

        // }

        // await this.fillNomineePage(TC_ID);

    }

    async fillNomineePage(Salutation: string, age: string, gender: string, relation: string, share: string, mobile: string, account: string, ifsc: string){

        // const data = getData("Nominee_Details_Page",TC_ID);
        
        const dropdown = new DropdownActions(this.page);
        
        // const planData = getData("Plan_Details_Page", TC_ID);
        // const homeData = getData("Home_Page", TC_ID)

        // let age : number = Number(data.Nominee_Age);
        // const convertage = new convertAge()
        
           
        await this.page.waitForLoadState('load');
        await dropdown.selectAntDropdown('Salutation', Salutation);
        
        await this.nomineeFirsrName.waitFor({state:'visible'});
        await this.nomineeFirsrName.fill(GenerateName.getName());  //fix
        await this.nomineeLastName.fill(GenerateName.getName());   //fix
        await this.nomineeDOB.fill(convertAge.convertAgeToDOB(age));  //Fix 

        await this.page.locator(`xpath=//button[text()='${gender}']`).click();

        await dropdown.selectAntDropdown('Relationship', relation);

        await this.nomineeShare.fill(share);
        await this.nomineeMobileNumber.fill(mobile);
        await this.nomineeAccountNo.fill(account);
        await this.nomineeIFSCCode.fill(ifsc);
        await this.page.waitForLoadState('networkidle');

        await this.nomineeAddressToggle.click();

        await this.page.waitForLoadState('networkidle');

        await this.addNomineeBtn.click();
        await this.page.waitForLoadState('networkidle');

        // await this.nextBtn.click();

        // GlobalConfig.actualResultSteps += " | Nominee page filled Successfully";
        // console.log("Nominee page filled Successfully");
            
    }

}