import { getData } from './readExcelUtil';
import { GlobalConfig } from '../config/globalConfig';

export class convertAge {

    static convertAgeToDOB(age: string): string {

    const data = getData("LA_Details_Page", GlobalConfig.testCaseID);

    const ageInt = parseInt(age, 10);
    const today = new Date();
    let dob: Date;

    if (ageInt === 0) {

        const noOfDays = parseInt(data['No_of_Days']);
        dob = new Date();
        dob.setDate(today.getDate() - noOfDays);

    } else {

        const birthYear = today.getFullYear() - ageInt;

        // // Generate random month (0-11)
        // const month = Math.floor(Math.random() * 12);

        // // Generate random day (1-28)
        // const day = Math.floor(Math.random() * 28) + 1;

        // dob = new Date(birthYear, month, day);

        // Select DOB as 01-01-Birthyear
        dob = new Date(birthYear, 0, 1);

        // Validation: ensure DOB is not after allowed date
        const checkDate = new Date(
        today.getFullYear() - ageInt,
        today.getMonth(),
        today.getDate()
        );

        if (dob > checkDate) {
        dob.setFullYear(dob.getFullYear() - 1);
        }
    }

    // Format DOB as dd-MM-yyyy
    const formattedDOB = this.formatDate(dob);
    return formattedDOB;
    }

    static formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
    }
}
