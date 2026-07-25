import { Locator, Page } from '@playwright/test';
import { getData } from '../utils/readExcelUtil';
import { GlobalConfig } from '../config/globalConfig';
import { env } from 'node:process';


 
export class LoginPage {
    readonly page: Page;
 
    //Create Variables to store objects
    
    readonly userName: Locator;
    readonly password: Locator;
    readonly loginBtn: Locator;
    readonly captcha: Locator;
 
    constructor(page: Page) {
        this.page = page;
       
        this.userName = page.locator("xpath=//input[@id='txtbxUserID']");
        this.password = page.locator("xpath=//input[@id='txtbxPassword']");
        this.captcha = page.locator("xpath=//input[@id='txtbxCaptcha']");
        this.loginBtn = page.locator("//*[@id='login']");
    }
 
    async login(TC_ID: string) {

        const LAdata = getData("Login_Page", TC_ID);
        await this.page.goto(process.env.AstraURL!,{waitUntil: 'load'});
        // await this.page.setViewportSize({ width: 1920, height: 1080 });
       
        // await this.page.waitForTimeout(2000);
        await this.userName.fill(LAdata.Username);
    
        // await this.page.waitForTimeout(2000);
        await this.password.fill(LAdata.Password);
        //await this.page.pause();
        await this.captcha.fill("1234");
       
        await this.loginBtn.click();

        GlobalConfig.actualResultSteps = `${LAdata.Username} Login Successfully`;
        console.log(GlobalConfig.actualResultSteps);
    }
 
}