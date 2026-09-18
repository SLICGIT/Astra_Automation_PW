import { Page, Locator } from '@playwright/test';
import { DropdownActions } from '../utils/dropdownsUtil';
import { getData } from '../utils/readExcelUtil';

export class PropMedicalPage {
  private page: Page;

  // Locators
  readonly weight: Locator;
  readonly height: Locator;
  readonly goodhealth: Locator;
  readonly GynDisorderQuestion: Locator;
  readonly SmokeQuestion: Locator;
  readonly SmokeQuantity: Locator;
  readonly WeightlossGainBtn: Locator;
  readonly SuicideAttempt: Locator;
  readonly AlcoholQuestion: Locator;
  readonly AlcoholQuantity: Locator;
  readonly DeformityQuestion: Locator;
  readonly AidWalkBtn: Locator;
  readonly DrugsQuestion:Locator;
  readonly DrugDetails:Locator;
  readonly LeaveQuestion:Locator;
  readonly LeaveDetails:Locator;
  readonly MedicalTreatmentQuestion:Locator;
  readonly MedicalTreatmentDetails:Locator;
  readonly AilmentsQuestion:Locator;
  readonly AilmentDetails:Locator;
  readonly BPDiaQuestion:Locator;
  readonly BPDiaDetails:Locator;
  readonly HIVQuestion:Locator;
  readonly HIVDetails:Locator;
  readonly RespiratoryQuestion:Locator;
  readonly RespiratoryDetails:Locator;
  readonly OtherIllQuestion:Locator;
  readonly OtherIllDetails:Locator;
  readonly EarEyesDisorderQuestion:Locator;
  readonly EarEyesDisorderDetails:Locator;
  readonly HospitalIlQuestion:Locator;
  readonly HospitalIlDetails:Locator;
  readonly AnaemiaQuestion:Locator;
  readonly AnaemiaDetails:Locator;
  readonly PregnencyQuestion:Locator;
  readonly PregnancyDetails:Locator;
  readonly MisscarriageQuestion:Locator;
  readonly AbortionDetails:Locator;
  readonly DeliveredBabyQuestion:Locator;
  readonly DeliveryDetails:Locator;
  readonly GynProblemQuestion:Locator;
  readonly GynProblemDetails:Locator;
  readonly nextButton: Locator;

  // readonly weightGainQuestion: Locator;
  // readonly mentalIllnessQuestion: Locator;
  readonly proposerMedicalDetails: Locator;

  constructor(page: Page, TC_ID: string) {
    this.page = page;
    const LAdata = getData("Medical_Details_Page", TC_ID);

    // Basic fields
    this.weight = page.locator("//input[@id='Weight']");
    this.height = page.locator("//input[@id='Cms']");
    this.goodhealth = page.locator(`//button[@id='SmChPhydefMF' and text()='${LAdata.Qu_GoodHealth}']`);
    this.GynDisorderQuestion = page.locator(`//button[@id='SmChPhydefFem' and normalize-space(text())='${LAdata.Qu_GynDisorder}']`);
    this.SmokeQuestion = page.locator(`//button[@id='Smoke' and normalize-space(text())='${LAdata.Qu_Smoke}']`);
    this.SmokeQuantity = page.locator("//input[@id='QpDay1']");
    this.WeightlossGainBtn = page.locator("//button[@id='MedicDWLDWG' and normalize-space(text())='No']");
    this.SuicideAttempt = page.locator("//button[@id='MedicEmotionBreak' and normalize-space(text())='No']");
    this.AlcoholQuestion = page.locator(`//button[@id='ConAlcoh' and normalize-space(text())='${LAdata.Qu_Alcohol}']`);
    this.AlcoholQuantity = page.locator("//input[@id='QpDay2']");
    this.DeformityQuestion = page.locator(`//button[@id='BodyDef' and normalize-space(text())='${LAdata.Qu_Deformity}']`);
    this.AidWalkBtn = page.locator(`//button[@id='WalAid' and normalize-space(text())='${LAdata.Aid_Walk}']`);
    this.DrugsQuestion = page.locator(`//button[@id='Drugs' and normalize-space(text())='${LAdata.Qu_Drugs}']`);
    this.DrugDetails = page.locator("//input[@id='ProDet1']");
    this.LeaveQuestion = page.locator(`//button[@id='LeaveMG' and normalize-space(text())='${LAdata.Qu_Leave}']`);
    this.LeaveDetails = page.locator("//input[@id='ProDet2']");
    this.MedicalTreatmentQuestion = page.locator(`//button[@id='AcciMdTr' and normalize-space(text())='${LAdata.Qu_MedicalTreatment}']`);
    this.MedicalTreatmentDetails = page.locator("//input[@id='ProDet3']");
    this.AilmentsQuestion = page.locator(`//button[@id='AilmOrg' and normalize-space(text())='${LAdata.Qu_Ailments}']`);
    this.AilmentDetails = page.locator("//input[@id='ProDet4']");
    this.HIVQuestion = page.locator(`//button[@id='HIV/AIDS' and normalize-space(text())='${LAdata.Qu_Disease}']`);
    this.HIVDetails = page.locator("//input[@id='ProDet5']");
    this.RespiratoryQuestion = page.locator(`//button[@id='RespDis' and normalize-space(text())='${LAdata.Qu_Disorders}']`);
    this.RespiratoryDetails = page.locator("//input[@id='ProDet6']");
    this.BPDiaQuestion = page.locator(`//button[@id='BP/Diab' and normalize-space(text())='${LAdata.Qu_Diabetes}']`);
    this.BPDiaDetails = page.locator("//input[@id='ProDet7']");
    this.OtherIllQuestion = page.locator(`//button[@id='OthIll' and normalize-space(text())='${LAdata.Qu_Other_Illness}']`);
    this.OtherIllDetails = page.locator("//input[@id='ProDet8']");
    this.EarEyesDisorderQuestion = page.locator(`//button[@id='Eye/EarDis' and normalize-space(text())='${LAdata.Qu_EyeDisorder}']`);
    this.EarEyesDisorderDetails = page.locator("//input[@id='ProDet9']");
    this.HospitalIlQuestion = page.locator(`//button[@id='HospIll' and normalize-space(text())='${LAdata.Qu_Hospitalize}']`);
    this.HospitalIlDetails = page.locator("//input[@id='ProDet10']");
    this.AnaemiaQuestion = page.locator(`//button[@id='BloodDis' and normalize-space(text())='${LAdata.Qu_Anaemia}']`);
    this.AnaemiaDetails = page.locator("//input[@id='ProDet14']");
    this.PregnencyQuestion = page.locator(`//button[@id='CurPreg' and normalize-space(text())='${LAdata.Qu_Pregnant}']`);
    this.PregnancyDetails = page.locator("//input[@id='NoWkPreg']");
    this.MisscarriageQuestion = page.locator(`//button[@id='MisCar/Abo' and normalize-space(text())='${LAdata.Qu_Abortion}']`);
    this.AbortionDetails = page.locator("//input[@id='IfProDet11']");
    this.DeliveredBabyQuestion = page.locator(`//button[@id='DelBaby' and normalize-space(text())='${LAdata.Qu_Delivery}']`);
    this.DeliveryDetails = page.locator("//input[@id='LDelDate']");
    this.GynProblemQuestion = page.locator(`//button[@id='GynoProb' and normalize-space(text())='${LAdata.Qu_GynTreatment}']`);
    this.GynProblemDetails = page.locator("//input[@id='ProDetDiag']");
    this.nextButton = page.locator("//button[@id='MD_Next' ]");

    // this.weightGainQuestion = page.locator(`//button[@id='MedicDWLDWG' and text()='No']`);
    // this.mentalIllnessQuestion = page.locator(`//button[@id='MedicEmotionBreak' and text()='No']`);
    this.proposerMedicalDetails = page.locator("//h6[text()='Proposer Medical Details']");

  }

  // Main Method
  async fillPropMedicalDetails(TC_ID: string, planName: string) {

    const LAdata = getData("Medical_Details_Page", TC_ID);
    const data = getData("LA_Details_Page", TC_ID);
    const homeData = getData("Home_Page", TC_ID);

    const dropdown = new DropdownActions(this.page);

    await this.page.waitForLoadState('load');

    await this.page.waitForTimeout(2000);

    if(await this.proposerMedicalDetails.isVisible()){

        // Basic inputs
        await this.weight.fill(LAdata['Weight']);
        await this.height.fill(LAdata['Height']);

        //  Good Health Flow
        if (planName.startsWith(LAdata['GH_PlanName'])) {

        await this.goodhealth.click();

        if (data['LA_Gender'] === 'Female') {
            await this.GynDisorderQuestion.click();
        }

        } else {

        //  Smoke
        // if (!(planName.startsWith(LAdata['Health_PlanName1'])/* || planName.startsWith(LAdata['Health_PlanName2'])*/)) {

          await this.SmokeQuestion.click();

            if (LAdata['Qu_Smoke'] === 'Yes') {
            await dropdown.selectAntDropdown('SmTy', LAdata['Smoke_Type']);
            await this.SmokeQuantity.fill(LAdata['Smoke_Quantity']);  
            }
        // }
            // Flexi Shield Condition
        
        if (planName.toLowerCase() === 'shriram life flexi shield' || homeData.Proposal_Type === "Combo") {
            await this.WeightlossGainBtn.click();
            await this.SuicideAttempt.click();
        }

        //  Alcohol
        await this.AlcoholQuestion.click();

        if (LAdata['Qu_Alcohol'] === 'Yes') {
            await dropdown.selectAntDropdown('AlcohTy', LAdata['Alcohol_Type']);
            await this.AlcoholQuantity.fill(LAdata['Alcohol_Quantity']);
        }

        //  Deformity
        if (!planName.toLowerCase().startsWith("tulip combi")) {
            // await this.DeformityQuestion.click();
        }

        if (LAdata['Qu_Deformity'] === 'Yes') {
            await dropdown.selectAntDropdown('DefTy', LAdata['Deformity_Type']);
            await dropdown.selectAntDropdown('PerDis', LAdata['Disability%']);
            await dropdown.selectAntDropdown('Reason1', LAdata['Deformity_Reason']);

            await this.AidWalkBtn.click();

            await dropdown.selectAntDropdown('LimbAff', LAdata['Limbs_Affected']);
        }

        //  Drugs
        await this.DrugsQuestion.click();
        if (LAdata['Qu_Drugs'] === 'Yes') {
            await this.DrugDetails.fill(LAdata['Drug_Details']);
        }

        //  Leave
        await this.LeaveQuestion.click();
        if (LAdata['Qu_Leave'] === 'Yes') {
            await this.LeaveDetails.fill(LAdata['Leave_Details']);
        }

        //  Medical Treatment
        await this.MedicalTreatmentQuestion.click();
        if (LAdata['Qu_MedicalTreatment'] === 'Yes') {
            await this.MedicalTreatmentDetails.fill(LAdata['MedTreat_Details']);
        }

        // Ailments
        await this.AilmentsQuestion.click();
        if (LAdata['Qu_Ailments'] === 'Yes') {
            await this.AilmentDetails.fill(LAdata['Ailment_Details']);
        }

        //  Disease
        await this.HIVQuestion.click();
        if (LAdata['Qu_Disease'] === 'Yes') {
            await this.HIVDetails.fill(LAdata['Disease_Details']);
        }

        //  Respiratory
        await this.RespiratoryQuestion.click();
        if (LAdata['Qu_Disorders'] === 'Yes') {
            await this.RespiratoryDetails.fill(LAdata['Disorder_Details']);
        }

        //  Diabetes
        await this.BPDiaQuestion.click();
        if (LAdata['Qu_Diabetes'] === 'Yes') {
            await this.BPDiaDetails.fill(LAdata['Diabetes_Details']);
        }

        //  Other Illness
        await this.OtherIllQuestion.click();
        if (LAdata['Qu_Other_Illness'] === 'Yes') {
            await this.OtherIllDetails.fill(LAdata['OtherIll_Details']);
        }

        //  Eye Disorder
        await this.EarEyesDisorderQuestion.click();
        if (LAdata['Qu_EyeDisorder'] === 'Yes') {
            await this.EarEyesDisorderDetails.fill(LAdata['EyeDisorder_Details']);
        }

        //  Hospitalization
        await this.HospitalIlQuestion.click();
        if (LAdata['Qu_Hospitalize'] === 'Yes') {
            await this.HospitalIlDetails.fill(LAdata['Hospitalize_Details']);
        }

        // Anaemia
        await this.AnaemiaQuestion.click();
        if (LAdata['Qu_Anaemia'] === 'Yes') {
            await this.AnaemiaDetails.fill(LAdata['Anaemia_Details']);
        }

        // Female Specific
        if (data['LA_Gender'] === 'Female' && data['LA_Marital_Status'] === 'Married') {

            await this.PregnencyQuestion.click();
            if (LAdata['Qu_Pregnant'] === 'Yes') {
            await this.PregnancyDetails.fill(LAdata['Pregnancy_Weeks']);
            }

            await this.MisscarriageQuestion.click();
            if (LAdata['Qu_Abortion'] === 'Yes') {
            await this.AbortionDetails.fill(LAdata['Abortion_Date']);
            await this.page.keyboard.press('Enter');
            }

            await this.DeliveredBabyQuestion.click();
            if (LAdata['Qu_Delivery'] === 'Yes') {
            await this.DeliveryDetails.fill(LAdata['Delivery_Date']);
            await this.page.keyboard.press('Enter');
            }

            await this.GynProblemQuestion.click();
            if (LAdata['Qu_GynTreatment'] === 'Yes') {
            await this.GynProblemDetails.fill(LAdata['GynTreat_Details']);
            }
        }
        }

        // Next
        await this.nextButton.click();
        console.log(" Proposer Medical Details filled successfully");



    }
}
  

}

