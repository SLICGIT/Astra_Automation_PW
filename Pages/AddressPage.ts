import { Page, Locator } from '@playwright/test';
import { getData } from '../utils/readExcelUtil';
import { DropdownActions } from '../utils/dropdownsUtil';
import { ScreenshotUtil } from '../utils/screenshotUtil';
import { GlobalConfig } from '../config/globalConfig';

export class AddressPage {
  readonly page: Page;

  //  Locators
  readonly doorNo: Locator;
  readonly street: Locator;
  readonly pincode: Locator;
  //readonly PerArea: Locator;
  readonly CommAddressQues: Locator;
  readonly mobile: Locator;
  readonly verifyBtn: Locator;
  //readonly relationDropdown: Locator;
  readonly verifyReason: Locator;
  readonly okBtn: Locator;
  readonly whatsappQues: Locator;
  readonly email: Locator;
  readonly nextBtn: Locator;

  constructor(page: Page,TC_ID: string) {
    this.page = page;

    const LAdata = getData("Address_Details_Page", TC_ID)

    //  XPath / Locators (mapped from Katalon)
    this.doorNo = page.locator("//input[@name ='PerDoor']");
    this.street = page.locator("//input[@name ='PerStreet']");
    this.pincode = page.locator("//input[@name ='PerPinCode']");
    //this.PerArea = page.locator("")
    this.CommAddressQues =page.locator(`//label[contains(normalize-space(.), 'Is the Communication Address the Same as your Permanent Address?')]//following::button[.//span[text()='${LAdata.Comm_Address}']][1]`);
    this.mobile = page.locator("//input[@name='LAMob']");
    this.verifyBtn = page.locator("//span[text()='Verify']");
    //this.relationDropdown = page.locator("");
    this.verifyReason = page.locator("//input[@name='PleaseMentionReason']");
    this.okBtn = page.locator("//button[text()='Ok']");
    this.whatsappQues =page.locator(`//label[contains(normalize-space(.), 'Do You Wish to be Contacted on WhatsApp?')]/following::button[.//span[text()='${LAdata.WhatsApp}']][1]`)
    this.email = page.locator("//input[@name='emaA1']");
    this.nextBtn = page.locator("//span[text()='Next']");
  }

  async fillAddressDetails(TC_ID: string) {

    const LAdata = getData("Address_Details_Page", TC_ID)
    const dropdown = new DropdownActions(this.page)

    await this.page.waitForLoadState('load');

    // Door / Address
    await this.doorNo.fill(LAdata.Door_No);
    await this.street.fill(LAdata.Street);
    await this.pincode.fill(LAdata.Pincode);

    // Wait for dependent UI load
    await this.page.waitForTimeout(1000);

    // Area dropdown (hardcoded same as Katalon)
    await dropdown.selectAntDropdown('PerArea', 'Alwal');
     // Communication Address (dynamic XPath)
    await this.page.waitForLoadState('networkidle');
    await this.CommAddressQues.waitFor({state: 'visible'});
    await this.CommAddressQues.click();

    // Mobile
    await this.mobile.fill(LAdata.Mobile_Number);

    // Verify
    await this.verifyBtn.click();

    // Relationship dropdown

    await this.page.waitForLoadState('networkidle');
    
    await this.okBtn.waitFor({state : 'visible'})
    await this.okBtn.scrollIntoViewIfNeeded({timeout: 2000});
    await dropdown.selectDropdownValue('Relationship', 'Self');

    // Reason
    await this.verifyReason.fill('Ok');

    await this.okBtn.click();

    await this.page.waitForTimeout(1000);

    // WhatsApp
    await this.whatsappQues.click();

    // Email
    await this.email.fill(LAdata.EmaiID);

    // Next
    await this.nextBtn.click();

    await this.page.waitForLoadState('load');

    GlobalConfig.actualResultSteps += " | Address Details Page Filled Successfully";

    console.log('Address Details Filled Successfully');
  }
}
