import { Page, Locator } from '@playwright/test';
import { DropdownActions } from '../utils/dropdownsUtil';
import { getData } from '../utils/readExcelUtil';
import { ScreenshotUtil } from '../utils/screenshotUtil';
import { convertAge } from '../utils/convertAgeUtil';
import { GenerateName } from '../utils/generateNameUtil';
import { GlobalConfig } from '../config/globalConfig';

export class LAPage {
  readonly page: Page;

  // Locators
  //readonly LATitle: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly dob: Locator;
  readonly gender: Locator;
  readonly maritial_status: Locator;
  readonly fatherSpouseName: Locator;
  readonly aadhaar: Locator;
  readonly pan: Locator;
  //readonly LA_Income_Range: Locator;
  readonly annualIncome: Locator;
  //readonly language: Locator;
  //readonly LA_education: Locator;
  //readonly LA_Insurance_Obj: Locator;
  //readonly LA_duty_nature: Locator;
  //readonly LA_smoke: Locator;
  readonly LA_pep: Locator;
  //readonly LA_risk: Locator;
  readonly LA_Disability: Locator;
  //readonly LA_Occuoation: Locator;
  //readonly Child_Occupation: Locator;
  //readonly Student_Occuoation: Locator;
  //readonly NonStudent_Occuoation: Locator;
  //readonly Occuoation_Subcat: Locator;
  readonly EIA: Locator;
  //readonly Nationality: Locator;
  readonly nextBtn: Locator;
  readonly Error_msg_DOB: Locator;

  readonly mwpaOption: Locator;

  constructor(page: Page,TC_ID: string) {
    this.page = page;

    const LAdata = getData("LA_Details_Page", TC_ID)
    

    //this.LATitle = page.locator("xpath= ");

    this.firstName = page.locator("xpath=//input[@id='LAFN']");
    this.lastName = page.locator("xpath=//input[@id='LALN']");
    this.dob = page.locator("xpath=//input[@name='LADOB']");
    this.gender = page.locator(`//span[text()='${LAdata.LA_Gender}']`);
    this.maritial_status =page.locator(`//span[text()='${LAdata.LA_Marital_Status}']`);
    this.fatherSpouseName = page.locator("//input[@id='LAFS']");
    this.aadhaar = page.locator("//input[@id='LAAadNum']");
    this.pan = page.locator("//input[@id='LAPAN']");
    //this.LA_Income_Range = page.locator("");
    this.annualIncome = page.locator("//input[@id='LAAnIn']");
    //this.language  = page.locator('');
    //this.LA_education  = page.locator('');
    //this.LA_Insurance_Obj  = page.locator('');
    //this.LA_duty_nature  = page.locator('');
    //this.LA_smoke  = page.locator('');
    this.LA_pep  = page.locator(`//button[@name='LAPEP']//span[text()='${LAdata.LA_PEP}']`);
    //this.LA_risk  = page.locator('');
    this.LA_Disability  = page.locator(`//button[@name='livi_dis']//span[text()='${LAdata.LA_Disability}']`);
    //this.LA_Occuoation  = page.locator('');
    //this.Child_Occupation  = page.locator('');
    //this.Student_Occuoation  = page.locator('');
    //this.NonStudent_Occuoation = page.locator('');
    //this.Occuoation_Subcat = page.locator('');
    this.EIA = page.locator(`//button[@name='CustEIANo']//span[text()='${LAdata.LA_EIA}']`);
    //this.Nationality = page.locator('');
    this.nextBtn = page.locator("//button[@type='submit']//span[text()='Next']");
    this.Error_msg_DOB =page.locator("//span[@class='error-mgs']");

    this.mwpaOption =page.locator(`//button[@name='MWPAPolicy']/span[text()='${LAdata.LA_MWPA_Option}']`);
  }

  async fillLADetails(TC_ID: string) {

    const LAdata = getData("LA_Details_Page", TC_ID)

    const dropdown = new DropdownActions(this.page)

    const planData = getData("Plan_Details_Page", TC_ID)
    const homeData = getData("Home_Page", TC_ID)

    let age : number = Number(LAdata.LA_Age);
    // console.log(`LA age: ${age}`);
   
    await this.page.waitForLoadState('load');

    // Title
    await this.page.locator("[name='LATitle']").waitFor({state: 'visible'});
    await this.page.waitForTimeout(1000);
    await dropdown.selectAntDropdown('LATitle', LAdata.LA_Salutation);

    // Name
    await this.firstName.fill(GenerateName.getName()); //fix
    await this.lastName.fill(GenerateName.getName());

    // DOB
    await this.dob.fill(convertAge.convertAgeToDOB(LAdata.LA_Age)); // fix

    // Gender
    await this.gender.click();
    await this.page.waitForLoadState('load');
    // Marital Status
    await this.maritial_status.waitFor({state: 'visible'});
    await this.page.waitForTimeout(1000);
    await this.maritial_status.click();

    // Select MWPA Option
    if(LAdata.LA_Gender === 'Male' && LAdata.LA_Marital_Status === 'Married') {
      await this.mwpaOption.waitFor({state: 'visible', timeout: 5000});
      await this.mwpaOption.click();
    }

    await this.fatherSpouseName.fill(GenerateName.getName());  //fix=generateName()
    await this.aadhaar.fill(LAdata['LA_Aadhaar']);
    await this.pan.fill(LAdata['LA_PAN']);

    // Income (>=18)
    if (age >= 18) {
      await dropdown.selectAntDropdown( 'LAAnInR', LAdata.LA_Income_Range);
      await this.annualIncome.waitFor({state:'visible'});
      await this.annualIncome.fill(LAdata['LA_Income']);
    }

    // Dropdowns
    await dropdown.selectAntDropdown('LAPL', LAdata.LA_Language);
    await dropdown.selectAntDropdown('LAEduQual', LAdata.LA_Education);
    await dropdown.selectAntDropdown('LAOBJINS', LAdata.LA_Insurance_Obj);

    // POS condition
    if (homeData.Proposal_Type === 'POS') {     // this neeed to fix
      await dropdown.selectDropdownValueByLabel('Nature of Duties', LAdata.LA_DutyNature);
      // await dropdown.selectAntDropdown('Doyousmoke', LAdata.LA_Smoke);
    }

    //Below line is not required for A server
    await dropdown.selectAntDropdown('Doyousmoke', LAdata.LA_Smoke);

    // Screenshot
    await ScreenshotUtil.capture(this.page, 'LA_Details');

    // PEP
    await this.LA_pep.click();

    await dropdown.selectAntDropdown('LARisk_App', LAdata.LA_Risk_Appetite);

    // Disability
    await this.LA_Disability.click();

    // Occupation
    await dropdown.selectAntDropdown('Occ', LAdata.LA_Occupation);

    if (age < 6) {
      await dropdown.selectAntDropdown('ChildOccupation', LAdata.LA_Occupation_SubCat);
    } else if (age >= 6 && age < 18) {
      if (LAdata['LA_Occupation'] === 'Student') {
        await dropdown.selectAntDropdown('StudentOccupation', LAdata.LA_Occupation_SubCat);
      } else {
        await dropdown.selectAntDropdown('NonStudentOccupation', LAdata.LA_Occupation_SubCat);
      }
    } else {
      await dropdown.selectAntDropdown('SubOccSalEmp', LAdata.LA_Occupation_SubCat);
    }

    // EIA
    await this.EIA.click();

    // Nationality
    await dropdown.selectAntDropdown('Nationality', LAdata.LA_Nationality);

    await this.nextBtn.click();

    // Negative validation
    if (planData.TestCase_Type?.toLowerCase() === 'negative' && age < 18 && homeData.Life_Type === 'Own Life') {
      
      await this.Error_msg_DOB.waitFor({state: 'visible'});
      await this.Error_msg_DOB.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(200);
      const errorMsg = await this.Error_msg_DOB.textContent();

      await ScreenshotUtil.capture(this.page, "LA_Details");

      GlobalConfig.actualResult = String(errorMsg);
      const expected = planData.Expected_Result;

      if (errorMsg === expected || errorMsg?.includes(expected)) {
        console.log(`Validation message validated successfully: ${errorMsg}`);
        return;
      } else {
        throw new Error(' Validation message is incorrect');
      }

    }

    GlobalConfig.actualResultSteps += " | LA Details Page Filled Successfully";

    console.log("LA page filled Successfully");
  }

}