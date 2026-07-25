import { Page, Locator } from '@playwright/test';
import { getData } from './readExcelUtil';

export class addFund {
    readonly page: Page;
    readonly addFundButton: Locator;
    readonly fundName: (fundName: string) => Locator;
    readonly fundPercentage: Locator;
    readonly fundOkButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addFundButton = page.locator("(//h6[text()='Add Fund'])[1]");
        this.fundName = (fundName: string) => page.locator(`(//h6[text()='${fundName}'])[1]`);
        this.fundPercentage = page.locator("(//input[@name='Percentage'])[1]");
        this.fundOkButton = page.locator("(//button[text()='Ok'])[1]");
    }

    async selectFund(TC_ID: string) {

        const data = getData("Plan_Details_Page", TC_ID);

        if (data['Maximus_Fund%'] !== null && data['Maximus_Fund%'] !== '' && data['Maximus_Fund%'] !== '0') {
            
            await this.addFundButton.click();
            await this.fundName("Maximus").waitFor({state: 'visible'});
            await this.fundName("Maximus").click();
            await this.fundPercentage.fill(data['Maximus_Fund%']);
            await this.fundOkButton.click();

        }

        if (data['Accelerator_Fund%'] !== null && data['Accelerator_Fund%'] !== '' && data['Accelerator_Fund%'] !== '0') {
            
            await this.addFundButton.click();
            await this.fundName("Accelerator").waitFor({state: 'visible'});
            await this.fundName("Accelerator").click();
            await this.fundPercentage.fill(data['Accelerator_Fund%']);
            await this.fundOkButton.click();

        }

        if (data['Tyaseer_Fund%'] !== null && data['Tyaseer_Fund%'] !== '' && data['Tyaseer_Fund%'] !== '0') {
            
            await this.addFundButton.click();
            await this.fundName("Tyaseer fund").waitFor({state: 'visible'});
            await this.fundName("Tyaseer fund").click();
            await this.fundPercentage.fill(data['Tyaseer_Fund%']);
            await this.fundOkButton.click();

        }

        if (data['Balancer_Fund%'] !== null && data['Balancer_Fund%'] !== '' && data['Balancer_Fund%'] !== '0') {
            
            await this.addFundButton.click();
            await this.fundName("Balancer").waitFor({state: 'visible'});
            await this.fundName("Balancer").click();
            await this.fundPercentage.fill(data['Balancer_Fund%']);
            await this.fundOkButton.click();

        }

        if (data['Guardian_Fund%'] !== null && data['Guardian_Fund%'] !== '' && data['Guardian_Fund%'] !== '0') {
            
            await this.addFundButton.click();
            await this.fundName("Guardian").waitFor({state: 'visible'});
            await this.fundName("Guardian").click();
            await this.fundPercentage.fill(data['Guardian_Fund%']);
            await this.fundOkButton.click();

        }

        if (data['Preserver_Fund%'] !== null && data['Preserver_Fund%'] !== '' && data['Preserver_Fund%'] !== '0') {
            
            await this.addFundButton.click();
            await this.fundName("Preserver").waitFor({state: 'visible'});
            await this.fundName("Preserver").click();
            await this.fundPercentage.fill(data['Preserver_Fund%']);
            await this.fundOkButton.click();

        }

        if (data['Pension_Protector_Fund%'] !== null && data['Pension_Protector_Fund%'] !== '' && data['Pension_Protector_Fund%'] !== '0') {
            
            await this.addFundButton.click();
            await this.fundName("Pension Protector").waitFor({state: 'visible'});
            await this.fundName("Pension Protector").click();
            await this.fundPercentage.fill(data['Pension_Protector_Fund%']);
            await this.fundOkButton.click();

        }

        if (data['Pension_Balancer_Fund%'] !== null && data['Pension_Balancer_Fund%'] !== '' && data['Pension_Balancer_Fund%'] !== '0') {
            
            await this.addFundButton.click();
            await this.fundName("Pension Balancer").waitFor({state: 'visible'});
            await this.fundName("Pension Balancer").click();
            await this.fundPercentage.fill(data['Pension_Balancer_Fund%']);
            await this.fundOkButton.click();

        }

        if (data['Pension_maximiser_Fund%'] !== null && data['Pension_maximiser_Fund%'] !== '' && data['Pension_maximiser_Fund%'] !== '0') {
            
            await this.addFundButton.click();
            await this.fundName("Pension Maximiser").waitFor({state: 'visible'});
            await this.fundName("Pension Maximiser").click();
            await this.fundPercentage.fill(data['Pension_maximiser_Fund%']);
            await this.fundOkButton.click();

        }

        if (data['Pension_MultiCap_Fund%'] !== null && data['Pension_MultiCap_Fund%'] !== '' && data['Pension_MultiCap_Fund%'] !== '0') {
            
            await this.addFundButton.click();
            await this.fundName("Pension Multi Cap Aggressive Fund").waitFor({state: 'visible'});
            await this.fundName("Pension Multi Cap Aggressive Fund").click();
            await this.fundPercentage.fill(data['Pension_MultiCap_Fund%']);
            await this.fundOkButton.click();

        }

    }
}