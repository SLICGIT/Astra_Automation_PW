import { Page, Locator } from '@playwright/test';
import { getData } from '../utils/readExcelUtil';
import { DropdownActions } from '../utils/dropdownsUtil';
import { GenerateName } from '../utils/generateNameUtil';
import { GlobalConfig } from '../config/globalConfig';

export class PropOtherDetailsPage {
    readonly page: Page;

    // ---------------- LOCATORS ----------------

    readonly hobbiesYesNo: (value: string) => Locator;
    readonly hobbiesRemarks: Locator;

    readonly convictedYesNo: (value: string) => Locator;
    readonly convictedRemarks: Locator;

    readonly question3No: Locator;
    readonly question4No: Locator;

    readonly addMemberBtn: Locator;
    readonly name: Locator;
    readonly age: Locator;

    readonly diagnoseDate: Locator;
    readonly deathDate: Locator;
    readonly deathCause: Locator;

    readonly doneBtn: Locator;
    readonly nextBtn: Locator;
    readonly propoOtherDetails

    // ---------------- CONSTRUCTOR ----------------

    constructor(page: Page) {
        this.page = page;

        // Dynamic locators (based on value)
        this.hobbiesYesNo = (value: string) =>
            page.locator(`//div[contains(@class,'d-block') and contains(@class,'mt-4')]//p[contains(normalize-space(.),'adventurous hobbies')]/following::button[normalize-space(.//span)='${value}'][1]`);

        this.convictedYesNo = (value: string) =>
            page.locator(`//div[contains(@class,'d-block') and contains(@class,'mt-4')]//p[contains(normalize-space(.),'Have you ever been convicted')]/following::button[normalize-space(.//span)='${value}'][1]`);

        // Static locators
        this.hobbiesRemarks = page.locator("(//p[contains(text(), 'hobbies')]/following::textarea)[1]");
        this.convictedRemarks = page.locator("(//p[contains(text(), 'convicted')]/following::textarea)[1]");

        this.question3No = page.locator("//div[contains(@class,'d-block') and contains(@class,'mt-4')]//p[contains(normalize-space(.),'Has your application for any life insurance policy')]/following::button[normalize-space(.//span)='No'][1]");
        this.question4No = page.locator("//div[contains(@class,'d-block') and contains(@class,'mt-4')]//p[contains(normalize-space(.),' Please give details of your existing life insurance ')]/following::button[normalize-space(.//span)='No'][1]");

        this.addMemberBtn = page.locator("//button[normalize-space(.//span[text()='Add member'])]");
        this.name = page.locator("//input[@name='name']");
        this.age = page.locator("//input[@name='age']");

        this.diagnoseDate = page.locator("//input[@name='adverseDeath']");
        this.deathDate = page.locator("//input[@name='dateOfDeath']");
        this.deathCause = page.locator("//input[@name='causeOfDeath']");

        this.doneBtn = page.locator("//button[normalize-space()='Done']");
        this.nextBtn = page.locator("//button[normalize-space()='Next']");
        this.propoOtherDetails = page.locator("//div/label[text()='Proposer Other details']");
    }

    // ---------------- SINGLE METHOD (ALL ACTIONS) ----------------

    async fillpropOtherDetails(TC_ID: string) {

        const data = getData("Other_Details_Page", TC_ID);
        const homeData = getData("Home_Page", TC_ID);

        // Wait
        await this.page.waitForLoadState('load');
        //await this.page.pause();
        await this.page.waitForTimeout(2000);

        if(await this.propoOtherDetails.isVisible()){

        // ---------------- Question 1 ----------------

            await this.hobbiesYesNo(data['Qu_Hobbies']).waitFor({state:'visible'});
            await this.page.waitForTimeout(1000);
            await this.hobbiesYesNo(data['Qu_Hobbies']).click();

            if (data['Qu_Hobbies'] === 'Yes') {
                await this.hobbiesRemarks.fill(data['Hobbies_Details']);
            }

            // ---------------- Question 2 ----------------
            await this.convictedYesNo(data['Qu_Convicted']).waitFor({state:'visible'});
            await this.page.waitForTimeout(1000);
            await this.convictedYesNo(data['Qu_Convicted']).click();

            if (data['Qu_Convicted'] === 'Yes') {
                await this.convictedRemarks.fill(data['Convicted_Details']);
            }

            // ---------------- Question 3 & 4 ----------------
            await this.question3No.waitFor({state:'visible'});
            await this.page.waitForTimeout(1000);
            await this.question3No.click();
            await this.question4No.waitFor({state:'visible'});
            await this.page.waitForTimeout(1000);
            await this.question4No.click();

            // ---------------- FAMILY MEMBERS ----------------
            if (homeData['Proposal_Type'] !== 'POS') {

                await this.addFamilyMember(data['Family1_Age'], data['Family1_Status'], data['Family1_Relation'], data['Family1_HealthStatus'], data['Family1_HealthHistory'], data['Family1_DiagnoseDate'], data['Family1_DeathDate'], data['Family1_DeathCause'])
                await this.addFamilyMember(data['Family2_Age'], data['Family2_Status'], data['Family2_Relation'], data['Family2_HealthStatus'], data['Family2_HealthHistory'], data['Family2_DiagnoseDate'], data['Family2_DeathDate'], data['Family2_DeathCause'])

            }

         // ---------------- NEXT ----------------
            await this.nextBtn.click();

            GlobalConfig.actualResultSteps += " | Other Details Filled Successfully";

            console.log("Other Details Page filled Successfully")
    }
}

    async addFamilyMember(age: string, lifeStatus: string, relation: string, healthStatus: string, healthHistory: string, diagnoseDate: string, deathDate: string, deathCause: string) {
        
        const dropdown = new DropdownActions(this.page);

        await this.addMemberBtn.click();

        await this.name.fill(GenerateName.getName());
        await this.age.fill(age);

        await dropdown.selectAntDropdown('status', lifeStatus);
        await dropdown.selectAntDropdown('relationship', relation);

        if (lifeStatus === 'Alive') {

            await dropdown.selectAntDropdown('healthStatus', healthStatus);

            if (healthStatus === 'Adverse') {
                await dropdown.selectAntDropdown('adverseStatus', healthHistory);
                await this.diagnoseDate.fill(diagnoseDate);
            }

        } else {

            await this.deathDate.fill(deathDate);
            await this.deathCause.fill(deathCause);
        }

        await this.doneBtn.click();

        GlobalConfig.actualResultSteps += " | OtherDetails page filled Successfully";
        console.log("Proposer OtherDetails page filled Successfully");

    }

}