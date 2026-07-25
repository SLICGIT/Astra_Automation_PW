import { Page, expect } from '@playwright/test';
import { getData } from './readExcelUtil';
import { GlobalConfig } from '../config/globalConfig';

export async function handleBI(page: Page, BI_Required: string) {

    if (BI_Required === 'Yes') {
        const [download] = await Promise.all([
            page.waitForEvent('download'),   // listen BEFORE click
            await page.locator("//div[@class='BI_mainModal']//following::span[text()='Yes']").click()
        ]);

        await page.locator("//*[contains(text(),'Downloaded BI Successfully')]").waitFor({state: 'visible'});
        // Save file
        const fileName = await download.suggestedFilename();
        await download.saveAs(`${GlobalConfig.screenshotDir}\\${fileName}`);

        await page.locator("//div[@class='BI_mainModal']//following::span[text()='Ok']").click();

    } else {

        const biDownloadBtn = page.locator("//div[@class='BI_mainModal']//following::span[text()='No']");

        await biDownloadBtn.waitFor({ state: 'visible' , timeout: 1000 });
        await biDownloadBtn.click();
    }
}