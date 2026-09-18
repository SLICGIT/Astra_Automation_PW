import { Page, Locator } from '@playwright/test';
 
export class DropdownActions {
 
    page: Page;
 
    constructor(page: Page) {
        this.page = page;
    }
 
    async selectAntDropdown(dropdownName: string, valueToSelect: string) {
 
        const dropdown = this.page.locator(`div[name='${dropdownName}']`);
 
        //  Wait & Click dropdown
        await dropdown.waitFor({ state: 'visible' });
        await dropdown.click();
        
        await this.page.waitForTimeout(50);
 
        //  Loop similar to your Katalon logic
        for (let j = 0; j < 9; j++) {
 
            for (let i = 1; i <= 6; i++) {
 
                try {
 
                    const option = this.page.locator(
                        `(//div[contains(@class,'ant-select-item-option-content') and text()='${valueToSelect}'])[${i}]`
                    );
 
                    if (await option.isVisible()) {
                        await option.waitFor({state: 'visible'});
                        await option.click();
                        return;
                    }
 
                } catch (e) {
                    // ignore like Katalon
                }
 
                //  Arrow down (same as Actions.sendKeys)
                await this.page.keyboard.press('ArrowDown');
            }
        }
 
        throw new Error(`Value '${valueToSelect}' not found in dropdown '${dropdownName}'`);
    }


    async selectDropdownValue(labelText: string, valueToSelect: string) {
       
        const dropdownXpath = `(//label[normalize-space(text())='${labelText}']/preceding-sibling::div//div[contains(@class,'ant-select-selector')])[1]`;
 
        const dropdown = this.page.locator(`xpath=${dropdownXpath}`);
 
        // Click dropdown
        await dropdown.waitFor({ state: 'visible' });
        await dropdown.click();
 
        // await this.page.waitForTimeout(500); // equivalent of Thread.sleep
 
        for (let i = 0; i < 50; i++) {
            try {
            let optionXPath = `(//div[contains(@class,'ant-select-item-option-content') and normalize-space(text())='${valueToSelect}'])[1]`;
 
            const option1 = this.page.locator(`xpath=${optionXPath}`).first();
 
            if (await option1.isVisible()) {
                await option1.click();
                break;
            }
            } catch (e) {
            // ignore
            }
 
            try {
            let optionXPath = `(//div[contains(@class,'ant-select-item-option-content') and normalize-space(text())='${valueToSelect}'])[2]`;
 
            const option2 = this.page.locator(`xpath=${optionXPath}`).first();
 
            if (await option2.isVisible()) {
                await option2.click();
                break;
            }
            } catch (e) {
            // ignore
            }
 
            // Scroll dropdown using keyboard
            await this.page.keyboard.press('ArrowDown');
        }
    }


    async selectDropdownValueByLabel(labelText: string, valueToSelect: string) {
       
        const dropdownXpath = `(//label[.//span[normalize-space(text())='${labelText}']])/preceding-sibling::div//div[contains(@class,'ant-select-selector')]`;
 
        const dropdown = this.page.locator(`xpath=${dropdownXpath}`);
 
        // Click dropdown
        await dropdown.waitFor({ state: 'visible' });
        await dropdown.click();
 
        await this.page.waitForTimeout(200); // equivalent of Thread.sleep

        for (let i = 0; i < 50; i++) {
            try {
            let optionXPath = `(//div[contains(@class,'ant-select-item-option-content') and contains(text(),'${valueToSelect}')])[1]`;
 
            const option1 = this.page.locator(`xpath=${optionXPath}`).first();
 
            if (await option1.isVisible()) {
                await option1.click();
                break;
            }
            } catch (e) {
            // ignore
            }
 
            try {
            let optionXPath = `(//div[contains(@class,'ant-select-item-option-content') and contains(text(),'${valueToSelect}')])[2]`;
 
            const option2 = this.page.locator(`xpath=${optionXPath}`).first();
 
            if (await option2.isVisible()) {
                await option2.click();
                break;
            }
            } catch (e) {
            // ignore
            }
 
            // Scroll dropdown using keyboard
            await this.page.keyboard.press('ArrowDown');
        }


 
        // const optionXpath = `//div[contains(@class,'ant-select-item-option-content') and contains(text(),'${valueToSelect}')]`

        // const option = this.page.locator(optionXpath);

        // await option.waitFor({state: 'visible'});
        // await option.click();
        
    }


    async selectRiderDropdown(dropdownName: string, valueToSelect: string) {

        // Dropdown locator
        const dropdownXpath = `//div[contains(@class,'ant-modal-mask')]/following::div[@name='${dropdownName}'][1]`;
        
        const dropdown = this.page.locator(dropdownXpath);

        // Wait and click dropdown
        await dropdown.waitFor({ state: 'visible', timeout: 10000 });
        await dropdown.click();

        // Loop logic (same as your Groovy code)
        for (let j = 0; j < 63; j++) {
            for (let i = 1; i < 7; i++) {
            try {
                const optionXpath = `(//div[contains(@class,'ant-select-item-option-content') and text()='${valueToSelect}'])[${i}]`;
                const option = this.page.locator(optionXpath);

                if (await option.isVisible()) {
                await option.click();
                return;
                }
            } catch (e) {
                // Ignore exception (same behavior as Groovy)
            }

            // Scroll using keyboard (Arrow Down)
            // await this.page.keyboard.press('ArrowDown');
            // await page.waitForTimeout(200); // small wait to stabilize scrolling
            }
            await this.page.keyboard.press('ArrowDown');

        }

    }


    async selectMatRiderDropdown(dropdownName: string, valueToSelect: string) {

        // Dropdown locator
        const dropdownXpath = `//div[contains(@class,'ant-modal-mask')]/following::div[@name='${dropdownName}'][2]`;
        
        const dropdown = this.page.locator(dropdownXpath);

        // Wait and click dropdown
        await dropdown.waitFor({ state: 'visible', timeout: 10000 });
        await dropdown.click();

        // Loop logic (same as your Groovy code)
        for (let j = 0; j < 9; j++) {
            for (let i = 1; i < 7; i++) {
            try {
                const optionXpath = `(//div[contains(@class,'ant-select-item-option-content') and text()='${valueToSelect}'])[${i}]`;
                const option = this.page.locator(optionXpath);

                if (await option.isVisible()) {
                await option.click();
                return;
                }
            } catch (e) {
                // Ignore exception (same behavior as Groovy)
            }

            // Scroll using keyboard (Arrow Down)
            await this.page.keyboard.press('ArrowDown');
            // await page.waitForTimeout(200); // small wait to stabilize scrolling
            }

        }

    }


    async selectPlanPageDropdown(labelText: string, valueToSelect: string) {
       
        const dropdownXpath = `(//label[.//span[normalize-space(text())='${labelText}']])/preceding-sibling::div//div[contains(@class,'ant-select-selector')]`;
 
        const dropdown = this.page.locator(`xpath=${dropdownXpath}`);
 
        // Click dropdown
        await dropdown.waitFor({ state: 'visible' });
        await dropdown.click();
 
        // await this.page.waitForTimeout(500); // equivalent of Thread.sleep

        for (let i = 0; i < 50; i++) {
            try {
            let optionXPath = `(//div[contains(@class,'ant-select-item-option-content') and normalize-space(text())='${valueToSelect}'])[1]`;
 
            const option1 = this.page.locator(`xpath=${optionXPath}`).first();
 
            if (await option1.isVisible()) {
                await option1.click();
                break;
            }
            } catch (e) {
            // ignore
            }
 
            try {
            let optionXPath = `(//div[contains(@class,'ant-select-item-option-content') and normalize-space(text())='${valueToSelect}'])[2]`;
 
            const option2 = this.page.locator(`xpath=${optionXPath}`).first();
 
            if (await option2.isVisible()) {
                await option2.click();
                break;
            }
            } catch (e) {
            // ignore
            }
 
            // Scroll dropdown using keyboard
            await this.page.keyboard.press('ArrowDown');
        }

    }

}
 