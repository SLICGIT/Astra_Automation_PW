import { Page, Locator } from '@playwright/test';
import { getData } from '../utils/readExcelUtil';
import { DropdownActions } from '../utils/dropdownsUtil';

import { ScreenshotUtil } from '../utils/screenshotUtil';


export class smartCardPage{

    readonly page: Page;
    readonly smartcard : Locator;
    // readonly LAShortName: Locator;
    // readonly nomineeShortName: Locator;
    readonly nextBtn: Locator;
    readonly applySmartCardBtn: Locator;

    constructor(page:Page,TC_ID:string){
        this.page = page;
        this.smartcard = page.locator("xpath=//h6[normalize-space()='Smart Card Details']");
        this.nextBtn = page.locator("xpath=//button[normalize-space()='Next']");
        this.applySmartCardBtn = page.locator("xpath=//span[text()='No']");
         
    }

    async fillSmartCardPage(TC_ID:string){

        const dropdown = new DropdownActions(this.page)
        
        // const planData = getData("Plan_Details_Page", TC_ID);
        let pageVisible = false;

        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('networkidle');

        try {

            await this.smartcard.waitFor({state: 'visible', timeout: 10000});
            pageVisible = true;

        } catch {

            console.log("Smart Card Page is not visible");
            pageVisible = false;

        }

        if(pageVisible){

            // await this.applySmartCardBtn.click();
            dropdown.selectDropdownValueByLabel('Purpose Of Insurance','for higher education');
            await this.nextBtn.click();

        }

    }

}