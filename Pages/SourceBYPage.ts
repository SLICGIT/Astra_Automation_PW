import { Page, Locator, expect } from '@playwright/test';
import { DropdownActions } from '../utils/dropdownsUtil';
import { getData } from '../utils/readExcelUtil';


export class SourceByPage {
  private page: Page;

  // Locators
  policySourceByMeYes: Locator;
  //sourceByDropdown: Locator;
  sourceCodeDropdown: Locator;
  nextButton: Locator;
  confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.policySourceByMeYes = page.locator("//span[normalize-space(text())='Yes']");
    //this.sourceByDropdown = page.locator("//div[@name='SourceCode1']");
    this.sourceCodeDropdown = page.locator("//div[@name='SourceCode1']");
    this.nextButton = page.locator("//button[.//span[normalize-space(text())='Next']]");
    this.confirmButton = page.locator("//button[.//span[normalize-space(text())='Confirm']]");
  }

  //  Main method
  async fillSourceDetails(TC_ID : string) {

    const dropdown = new DropdownActions(this.page)
    const LAdata = getData("Login_Page", TC_ID)

    

    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(2000);

    await this.policySourceByMeYes.waitFor({ state: 'visible' });
    await this.policySourceByMeYes.click();

    // Select Source By
    await dropdown.selectAntDropdown('SourceBy1', 'Direct');

    // Click Source Code Dropdown

     
    await this.sourceCodeDropdown.click();

    // Select option dynamically (based on userID)
    const sourceCodeOption = this.page.locator(
      `//div[contains(@class,'ant-select-item-option-content') and contains(text(),'${LAdata.Username}')]`
    );

    await sourceCodeOption.waitFor({ state: 'visible' });
    await sourceCodeOption.click();

    await this.page.waitForLoadState('load');

    // await this.page.pause();

    // Click Next & Confirm
    await this.nextButton.waitFor({state: 'visible'});
    await this.nextButton.click();
    await this.confirmButton.waitFor({state: 'visible'});
    await this.confirmButton.click();

  }

}