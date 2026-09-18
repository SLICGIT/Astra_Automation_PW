import { Page, Locator } from '@playwright/test';
import { getData } from '../utils/readExcelUtil';
import { DropdownActions } from '../utils/dropdownsUtil';
import { GenerateName } from '../utils/generateNameUtil';
import { convertAge } from '../utils/convertAgeUtil';
import { GlobalConfig } from '../config/globalConfig';
import { ok } from 'node:assert'


export class ProposerDetailsPage {

    readonly page: Page;

    //  Locators
    //readonly titleDropdown: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly dob: Locator;
    readonly aadhaar: Locator;
    readonly fatherName: Locator;
    //readonly relationLA: Locator;
    //readonly sourceOfIncome: Locator;
    readonly pan: Locator;
    //readonly education: Locator;
    readonly occupation: Locator;
    readonly income: Locator;
    //readonly nationality: Locator;
    readonly mobile: Locator;
    readonly verifyMobileBtn: Locator;
    //readonly relationshipDropdown: Locator;
    readonly verifyReason: Locator;
    readonly okBtn: Locator;
    readonly disabilityNo: Locator;
    readonly nextBtn: Locator;
    readonly EIA: Locator;
    readonly PEP: Locator;

    constructor(page: Page, TC_ID: string) {
        this.page = page;
        const LAdata = getData("Proposer_Details_Page", TC_ID)

        //  XPath Locators
        //this.titleDropdown = page.locator();
        this.firstName = page.locator("//input[@name='FN1']");
        this.lastName = page.locator("//input[@name='LN1']");
        this.dob = page.locator("//input[@name='DOB1']");
        this.aadhaar = page.locator("//input[@name='AA1']");
        this.fatherName = page.locator("//input[@name='NBLAFS']");
        //this.relationLA = page.locator("");
        //this.sourceOfIncome = page.locator("");
        this.pan = page.locator("//input[@name='PA1']");
        //this.education = page.locator("");
        this.occupation = page.locator("//input[@name='OC1']");
        this.income = page.locator("//input[@name='ProposerAnnualIncome']");
        //this.nationality = page.locator("//div[@id='NT1']");
        this.mobile = page.locator("//input[@name='ProposerMobileNumber']");
        this.verifyMobileBtn = page.locator("//span[normalize-space(text())='Verify']");
        //this.relationshipDropdown = page.locator("//div[@id='Relationship']");
        this.verifyReason = page.locator("//input[@name='PleaseMentionReason']");
        this.okBtn = page.locator("//button[text()='Ok']");
        this.EIA = page.locator(`//button[@name='CustEIANo']//span[text()='${LAdata.Prop_EIA}']`);
        this.PEP = page.locator(`//label[contains(text(), 'PEP')]/following-sibling::div/button/span[text()='${LAdata.Prop_PEP}']`)
        this.disabilityNo = page.locator("//button[@name='livi_dis']/span[text()='No']");
        this.nextBtn = page.locator("//span[normalize-space(text())='Next']");
    }

    //  Single Method for UI Activities (as requested)
    async fillProposerDetails(TC_ID: string) {

        const LAdata = getData("Proposer_Details_Page", TC_ID)
        const dropdown = new DropdownActions(this.page)
        const homeData = getData("Home_Page", TC_ID)

        await this.page.waitForLoadState('load');

        await dropdown.selectAntDropdown('TPR1', LAdata.Prop_Salutation);

        await this.firstName.fill(GenerateName.getName());
        await this.lastName.fill(GenerateName.getName());

        await this.dob.fill(convertAge.convertAgeToDOB(LAdata.Prop_Age));
        await this.aadhaar.click();
        await this.page.waitForLoadState('load');
        await this.aadhaar.fill(LAdata.Prop_Aadhaar);

        if(homeData.Proposal_Type !== 'Combo') {
            await dropdown.selectAntDropdown('PRGN', LAdata.Prop_Gender);
            await dropdown.selectAntDropdown('ProMS', LAdata.Prop_MaritalStatus);
        }

        await this.fatherName.fill(GenerateName.getName());
        await dropdown.selectAntDropdown('PropRelLA', LAdata.Prop_Relation);

        if (homeData.Proposal_Type === 'POS') {
            await dropdown.selectAntDropdown('SourceOfIncome', 'Salary');
        }

        await this.pan.fill(LAdata.Prop_PAN);
        await dropdown.selectAntDropdown('PropEDuQual', 'Graduation');

        if(homeData.Proposal_Type !== 'Combo') {
            await dropdown.selectAntDropdown('LAAnInR', LAdata.Prop_Income_Range);
        } else {
            await this.occupation.fill(LAdata.Prop_Occupation);
            await dropdown.selectAntDropdown('NT1', 'Indian');
        }

        // await this.occupation.fill(LAdata.Prop_Occupation);
        await this.income.fill(LAdata.Prop_Income);

        // await dropdown.selectAntDropdown('NT1', 'Indian');

        await this.mobile.fill(LAdata.Prop_Mobile);
        await this.verifyMobileBtn.click();

        //await waitForLoader(this.page);

        await this.page.waitForLoadState('networkidle');
        await this.okBtn.waitFor({state: 'visible'});
        await this.okBtn.scrollIntoViewIfNeeded();
        await dropdown.selectDropdownValue("Relationship", "Self");
        await this.verifyReason.fill('Ok');

        await this.okBtn.click();

        //await waitForLoader(this.page);
        await this.page.waitForLoadState('networkidle');

        await this.disabilityNo.click();

        if(homeData.Proposal_Type !== 'Combo') {
            await this.PEP.click();
            await this.EIA.click();
            await dropdown.selectAntDropdown('Occ', LAdata.Prop_Occupation);
            await dropdown.selectAntDropdown('SubOccSalEmp', LAdata.Prop_Occupation_SubCat);
            await dropdown.selectAntDropdown('Nationality', "Indian");
        }
        

        await this.nextBtn.click();

        GlobalConfig.actualResultSteps += " | Proposer Details Page Filled Successfully";

        console.log(" Proposer Details filled successfully");
    }

}