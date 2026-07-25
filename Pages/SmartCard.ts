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

    constructor(page:Page,TC_ID:string){
        this.page = page;
        this.smartcard = page.locator("xpath=//h6[normalize-space()='Smart Card Details']");
        this.nextBtn = page.locator("xpath=//button[normalize-space()='Next']");
         
    }

    async fillSmartCardPage(TC_ID:string){

        const dropdown = new DropdownActions(this.page)
        
        const planData = getData("Plan_Details_Page", TC_ID);

        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('networkidle');
        if(await this.smartcard.isVisible({timeout:3000})){

            dropdown.selectDropdownValueByLabel('Purpose Of Insurance','for higher education');
            await this.nextBtn.click();
        }




    }
}