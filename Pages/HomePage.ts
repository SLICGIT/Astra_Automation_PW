import { Page, Locator } from '@playwright/test';
import { getData } from '../utils/readExcelUtil';
import { ScreenshotUtil } from '../utils/screenshotUtil';
import { GlobalConfig } from '../config/globalConfig';

export class HomePage {
  readonly page: Page;

  // Locators
  readonly createNewProposal: Locator;
  readonly newProposal: Locator;
  readonly Proposal_Type: Locator;
  readonly Customer_Type: Locator;
  readonly Policy_Type: Locator;
  readonly Life_Type: Locator;
  readonly KYC_Type: Locator;
  readonly continueBtn: Locator;



  constructor(page: Page, TC_ID: string) {

    this.page = page;
    const LAdata = getData("Home_Page", TC_ID)

    this.createNewProposal = page.locator("//span[text()='Create New Proposal']");
    this.newProposal = page.locator("//span[contains(text(), 'New Proposal')]");
    this.Proposal_Type = page.locator(`//span[text()='${LAdata.Proposal_Type}']`);
    this.Customer_Type = page.locator(`//div[@class='Basic_Details_bgd']/label[text()='${LAdata.Customer_Type}']`);
    this.Policy_Type = page.locator(`//label[text()='${LAdata.Policy_Type}']`);
    this.Life_Type = page.locator(`//div[text()='${LAdata.Life_Type}']`);
    this.KYC_Type = page.locator(`//label[text()='${LAdata.KYC_Type}']`);
    this.continueBtn = page.locator("//span[contains(text(), 'Continue')]");
  }

  async chooseProposalType(TC_ID: string) {

    const data = getData('Home_Page', TC_ID);

    await this.page.waitForLoadState('load');

    // Click Create New Proposal
    await this.createNewProposal.click();

    await this.page.waitForLoadState('load');

    await this.page.waitForTimeout(1000);


    // Click New Proposal
    await this.newProposal.click();

    await this.page.waitForLoadState('load');

    // Dynamic selections (same as Katalon XPath parameter)
    await this.Proposal_Type.click();

   

    // Screenshot
    // await ScreenshotUtil.capture(this.page, 'Basic_Details');

    await this.Customer_Type.click();
    await this.Policy_Type.click();
    await this.Life_Type.click();
    await this.KYC_Type.click();

    
    await this.continueBtn.click();

    GlobalConfig.actualResultSteps += " | Basic Details Filled Successfully";

    console.log('Basic Details Filled Successfully');
  }
}