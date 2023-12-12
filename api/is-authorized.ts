
// import axios
import axios from 'axios';
import { AccessError, User } from './globals';

import env from './env';
let workbookID = env.WORKBOOK_ID;
let API_KEY = env.API_KEY;
let userSheetID = env.USER_SHEET_ID;
axios.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';


export async function IsAuthorized(user :User) {
    if(user.email === "") {
        return {success: false, message: AccessError.NO_USER};
    }
    
    let url = `https://sheet.rocks/api/v1/workbook/${workbookID}/sheet/${userSheetID}/db/findone`;
    let res = await axios.get(url, {data: {MatchFormula: `LOWER(COL[A]) = LOWER("${user.email}")`}, validateStatus: () => true});

    if(res.status !== 200) {
        console.log(res);
        return {success: false, message: AccessError.SYSTEM_ERROR}
    }

    let exists = res.data.length > 0;

    if(!exists) {
        let url = `https://sheet.rocks/api/v1/workbook/${workbookID}/sheet/${userSheetID}/append`;
        let res = await axios.post(url, {Cells: [[user.email, user.name]]}, {validateStatus: () => true});
        if(res.status !== 200) {
            console.log(res);
            return {success: false, message: AccessError.SYSTEM_ERROR}
        }
    }

    return {success: true};
}