export const GlobalConfig = {
  screenshotDir: process.env.screenshotDir!,
  reportPath: process.env.reportPath!,
  ssCount: 1,
  planName: '',
  testCaseID: '',
  date: '',
  time: '',

  proposalNo: '',
  status: '',
  actualResult: '',
  basePremAmount: '',
  totalAmount: '',
  saAmount: '',
  apAmount: '',
  executionTime: '',
  userID: '',
  actualResultSteps: ''
};

export function resetGlobalConfig() {
  GlobalConfig.screenshotDir = process.env.screenshotDir!;
  GlobalConfig.reportPath = process.env.reportPath!;
  GlobalConfig.ssCount = 1;
  GlobalConfig.planName = '';
  GlobalConfig.testCaseID = '';
  GlobalConfig.date = '';
  GlobalConfig.time = '';

  GlobalConfig.proposalNo = '';
  GlobalConfig.status = '';
  GlobalConfig.actualResult = '';
  GlobalConfig.basePremAmount = '';
  GlobalConfig.totalAmount = '';
  GlobalConfig.saAmount = '';
  GlobalConfig.apAmount = '';
  GlobalConfig.executionTime = '';
  GlobalConfig.userID = '';
  GlobalConfig.actualResultSteps = '';
}