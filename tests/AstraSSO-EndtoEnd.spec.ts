import { test, Locator, Page } from '@playwright/test';

import { getExecutableTestData } from '../utils/excelFilterUtil';
import { ScreenshotUtil } from '../utils/screenshotUtil';
import { GlobalConfig, resetGlobalConfig } from '../config/globalConfig';
import 'dotenv/config';
import { createReportSheet } from '../utils/createExcelUtil';
import { writeReportRow } from '../utils/writeExcelUtil';
import { getData } from '../utils/readExcelUtil';
import { LoginPage } from '../Pages/LoginPage';
import { HomePage } from '../Pages/HomePage';
import { LAPage } from '../Pages/LAPage';
import { ProposerDetailsPage } from '../Pages/ProposarPage';
import { AddressPage } from '../Pages/AddressPage';
import { SourceByPage } from '../Pages/SourceBYPage';
import { MedicalPage } from '../Pages/MedicalPage';
import{PropMedicalPage} from '../Pages/PropMedicalPage'
import { nomineePage } from '../Pages/NomineePage';
import { smartCardPage } from '../Pages/SmartCard';
import { declarationPage } from '../Pages/declarationPage';
import { documentsPage } from '../Pages/DocumentsPage';
import { NACHRegistrationPAge } from '../Pages/NACHPage';
import { paymentPage } from '../Pages/PaymentPage';
import { OtherDetailsPage } from '../Pages/OtherDetailsPage';
import { PropOtherDetailsPage } from '../Pages/PropOtherDetailsPage';
import { ASP } from '../Pages/Plan_Details_Page/Assured_Savings_Plan';
import { AIP } from '../Pages/Plan_Details_Page/Assured_Income_Plan';
import { SunischitLaabh } from '../Pages/Plan_Details_Page/Sunischit_Laabh';
import { SCP } from '../Pages/Plan_Details_Page/Smart_Choice_Plan';
import {SIP} from '../Pages/Plan_Details_Page/Super_Income_Plan';
import {PAB} from '../Pages/Plan_Details_Page/Premier_Assured_Benefit';
import { flexiShield } from '../Pages/Plan_Details_Page/Flexi_Shield';
import { PensionPlus } from '../Pages/Plan_Details_Page/Pension_Plus';
import {ECP} from '../Pages/Plan_Details_Page/Early_Cash_Plan';
import {FPP} from '../Pages/Plan_Details_Page/Family_Protection_Plan';
import { SPP_SP_POS } from '../Pages/Plan_Details_Page/SPP_SP_POS';
import {SPP_RP} from '../Pages/Plan_Details_Page/SPP_RP';
import { NSV } from '../Pages/Plan_Details_Page/Shriram_New_Shrividya';
import { NSL } from '../Pages/Plan_Details_Page/NEW SHRI LIFE PLAN';
import { GrowthPlus } from '../Pages/Plan_Details_Page/Growth_Plus_Plan';
import { FortuneBuilder } from '../Pages/Plan_Details_Page/Fortune_Builder_Plan';
import { GoldenJubilee } from '../Pages/Plan_Details_Page/Golden_Jubilee';
import { WealthPro } from '../Pages/Plan_Details_Page/WealthPro';
import { TulipCombi1 } from '../Pages/Plan_Details_Page/Tulip_Combi_1';
import { TulipCombi2 } from '../Pages/Plan_Details_Page/Tulip_Flexi_Wealth';
import { profileEnd } from 'node:console';

const excelPath = process.env.excelFilePath!;

// Define hooks here (top of test file)
test.beforeEach(async ({ page }, testInfo) => {
    console.log("BeforeEach Started");
    resetGlobalConfig();
});

test.afterEach(async ({ page }, testInfo) => {

    const LAdata = getData("Login_Page", GlobalConfig.testCaseID);
    const data = getData("Plan_Details_Page", GlobalConfig.testCaseID);
    
    const totalSeconds = Math.floor(testInfo.duration / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    GlobalConfig.executionTime = `${minutes} min ${seconds} sec`;
    GlobalConfig.status = String(testInfo.status);

    writeReportRow(LAdata.Username, data.TestCase_Desc, data.TestCase_Type, data.Expected_Result);

    console.log("AfterEach Completed");
});


const testData = getExecutableTestData(excelPath, "Login_Page");

for (const data of testData) {

    test(`End to End Execution : ${data.TC_ID}`, async({ page }) => {

        try {
            const homeData = getData("Home_Page", data.TC_ID);
            const planData = getData("Plan_Details_Page", data.TC_ID);
            const LAdata = getData("LA_Details_Page", data.TC_ID);

            await ScreenshotUtil.createScreenshotDir(data.TC_ID);
            console.log("Screenshot folder is created");
            await createReportSheet();
            
            //Creating instances of the pages
            const login = new LoginPage(page);
            const home = new HomePage(page, data.TC_ID);

            await login.ssoLogin(data.TC_ID);
            // await page.pause();
            // await home.chooseProposalType(data.TC_ID);

            const astraPage = await home.launchAstra();

            // Create another page object using the new Astra tab
            const astraHomePage = new HomePage(astraPage, data.TC_ID);

            const LA_Details = new LAPage(astraPage,data.TC_ID);
            const proposerPage = new ProposerDetailsPage(astraPage,data.TC_ID);
            const address = new AddressPage(astraPage,data.TC_ID);
            const sourceBy = new SourceByPage(astraPage);
            const medical = new MedicalPage(astraPage,data.TC_ID);
            const propMedical = new PropMedicalPage(astraPage,data.TC_ID);
            const otherPage = new OtherDetailsPage(astraPage);
            const propotherPage = new PropOtherDetailsPage(astraPage);
            const nominee = new nomineePage(astraPage, data.TC_ID);
            const smartcard = new smartCardPage(astraPage,data.TC_ID);
            const documents = new documentsPage(astraPage,data.TC_ID);
            const declaration = new declarationPage(astraPage,data.TC_ID);
            const NACH = new NACHRegistrationPAge(astraPage,data.TC_ID);
            const payment = new paymentPage(astraPage,data.TC_ID);

            // Continue the Astra execution
            await astraHomePage.chooseProposalType(data.TC_ID);

            await LA_Details.fillLADetails(data.TC_ID);

            // Negative validation
            let age : number = Number(LAdata.LA_Age);
            console.log(`LA age: ${age}`);
            if (planData.TestCase_Type?.toLowerCase() === 'negative' && age < 18 && homeData.Life_Type === 'Own Life') {
                return;
            }

            if(homeData.Life_Type === "Other Life") {
                await proposerPage.fillProposerDetails(data.TC_ID);
            }

            await address.fillAddressDetails(data.TC_ID);

            switch (true) {

                case GlobalConfig.planName.toLowerCase().startsWith('shriram life assured savings plan'):
                    await new ASP(astraPage).fillPlanDetails(data.TC_ID);
                    break;

                case GlobalConfig.planName.toLowerCase().startsWith('shriram life assured income plan'):
                    await new AIP(astraPage).fillPlanDetails(data.TC_ID);
                    break;

                case GlobalConfig.planName.toLowerCase().startsWith('shriram life sunishchit laabh'):
                    await new SunischitLaabh(astraPage).fillPlanDetails(data.TC_ID);
                    break;

                case GlobalConfig.planName.toLowerCase().startsWith('shriram life smart choice plan'):
                    await new SCP(astraPage).fillPlanDetails(data.TC_ID);
                    break;

                case GlobalConfig.planName.toLowerCase().startsWith('shriram life super income plan'):
                    await new SIP(astraPage).fillPlanDetails(data.TC_ID);
                    break;

                case GlobalConfig.planName.toLowerCase().startsWith('shriram life premier assured benefit'):
                    await new PAB(astraPage).fillPlanDetails(data.TC_ID);
                    break;

                case GlobalConfig.planName.toLowerCase().startsWith('shriram life flexi shield'):
                    await new flexiShield(astraPage).fillPlanDetails(data.TC_ID);
                    break;

                case GlobalConfig.planName.toLowerCase().startsWith('shriram life pension plus'):
                    await new PensionPlus(astraPage).fillPlanDetails(data.TC_ID);
                    break;

                case GlobalConfig.planName.toLowerCase().startsWith('shriram life early cash plan'):
                    await new ECP(astraPage).fillPlanDetails(data.TC_ID);
                    break;

                case GlobalConfig.planName.toLowerCase().startsWith('shriram life family protection plan'):
                    await new FPP(astraPage).fillPlanDetails(data.TC_ID);
                    break;

                case GlobalConfig.planName.toLowerCase().startsWith('shriram life smart protection plan sp'):
                    await new SPP_SP_POS(astraPage).fillPlanDetails(data.TC_ID);
                    break;

                case GlobalConfig.planName.toLowerCase().startsWith('shriram life smart protection plan'):
                    await new SPP_RP(astraPage).fillPlanDetails(data.TC_ID);
                    break;

                case GlobalConfig.planName.toLowerCase().startsWith('shriram new shri vidya'):
                    await new NSV(astraPage).fillPlanDetails(data.TC_ID);
                    break;    
 
                case GlobalConfig.planName.toLowerCase().startsWith('shriram new shri life plan'):
                    await new NSL(astraPage).fillPlanDetails(data.TC_ID);
                    break;
                   
                case GlobalConfig.planName.toLowerCase().startsWith('shriram life growth plus'):
                    await new GrowthPlus(astraPage).fillPlanDetails(data.TC_ID);
                    break;
 
                case GlobalConfig.planName.toLowerCase().startsWith('shriram fortune builder'):
                    await new FortuneBuilder(astraPage).fillPlanDetails(data.TC_ID);
                    break;
               
                case GlobalConfig.planName.toLowerCase().startsWith('shriram life golden jubilee plan'):
                    await new GoldenJubilee(astraPage).fillPlanDetails(data.TC_ID);
                    break;
               
                case GlobalConfig.planName.toLowerCase().startsWith('shriram life wealth pro'):
                    await new WealthPro(astraPage).fillPlanDetails(data.TC_ID);
                    break;

                case GlobalConfig.planName.toLowerCase().startsWith('flexi fortune'):
                    await new TulipCombi1(astraPage).fillPlanDetails(data.TC_ID);
                    break;

                case GlobalConfig.planName.toLowerCase().startsWith('flexi wealth'):
                    await new TulipCombi2(astraPage).fillPlanDetails(data.TC_ID);
                    break;

                default:
                    console.log("Plan name not found in screen");
                    break;
            }

            // Negative Scenario
            if (planData.TestCase_Type?.toString().toLowerCase() === "negative") {
                return;
            }

            await sourceBy.fillSourceDetails(data.TC_ID);
            await medical.fillMedicalDetails(data.TC_ID, planData.Plan_Name);
            await propMedical.fillPropMedicalDetails(data.TC_ID, planData.Plan_Name);
            await otherPage.fillOtherDetails(data.TC_ID);
            await propotherPage.fillpropOtherDetails(data.TC_ID);

            if(homeData.Life_Type !== "Other Life") {
                // await nominee.fillNomineePage(data.TC_ID);
                await nominee.addNominee(data.TC_ID);
            }

            await smartcard.fillSmartCardPage(data.TC_ID);
            await declaration.fillDeclarationPage(data.TC_ID,homeData.Life_Type,homeData.Proposal_Type);
            await documents.fillDocumentPage(homeData.Life_Type,data.TC_ID);
            await NACH.fillNACHPage(data.TC_ID);
            await payment.fillPaymentPage(data.TC_ID, homeData.Proposal_Type);

        } catch (error) {
            await ScreenshotUtil.capture(page, "Execution_Failure");
            throw error;
        }

    });
}
