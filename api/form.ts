// import axios
import axios from 'axios';
import { IsAuthorized } from './is-authorized';
import fs from 'fs';
import { User, Request } from './globals';
import { FormData } from '../web/form';
import env from './env';
let workbookID = env.WORKBOOK_ID;
let API_KEY = env.API_KEY;
let formSheetID = env.FORM_SHEET_ID;
axios.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';


async function main(req :Request) {
    let isAuthorizedResponse = await IsAuthorized(req.user);

    if(!isAuthorizedResponse.success) {
        return {success: false, message: isAuthorizedResponse.message};
    }

    // if method is not "GET", return
    if (req.method === "GET") {
        let res = await axios.get(`https://sheet.rocks/api/v1/workbook/${workbookID}/sheet/${formSheetID}/db/findmany`, {
            data: { MatchFormula: `=COL[B] = "${req.user.email}"` },
        });

        if(res.status !== 200) {
            return {success: false, message: "System error - could not get tasks"};
        }
    
        let formData = (res.data as string[][]).map((row) => {
            return {
                id: row[0],
                submitterEmail: row[1],
                widgetCount: parseInt(row[2]),
                submissionDate: row[3],
            } as FormData})

        return {success: true, formData};
    }

    if(req.method === "PUT") {
        if(!req.body.formData) {
            return {success: false, message: "No form data provided"};
        }

        let res = await axios.get(`https://sheet.rocks/api/v1/workbook/${workbookID}/sheet/${formSheetID}/db/findone`, {
            data : {
            MatchFormula: `=COL[A] = "${req.body.formData!.id}"`,
        }});

        if(res.status !== 200) {
            return {success: false, message: "System error - could not update task"};
        }

        if(res.data.length === 0) {
            return {success: false, message: "Task not found"};
        }

        let formData = (res.data as string[][]).map((row) => {
            return {
                id: row[0],
                submitterEmail: row[1],
                widgetCount: parseInt(row[2]),
                submissionDate: row[3],
        } as FormData})[0];


        // use replaceone to update the task, uses the same MatchFormula as findone and ReplaceWith string[][]
        let replaceRes = await axios.put(`https://sheet.rocks/api/v1/workbook/${workbookID}/sheet/${formSheetID}/db/replaceone`, {
            MatchFormula: `=COL[A] = "${req.body.formData!.id}"`,
            ReplaceWith: [formData.id, formData.submitterEmail, `${req.body.formData.widgetCount}`, formData.submissionDate],
        });

        if(replaceRes.status !== 200) {
            return {success: false, message: "System error - could not update task"};
        }

        return {success: true};
    }

    if(req.method === "POST") {
        if(!req.body.formData) {
            return {success: false, message: "No form data provided"};
        }

        let newFormEntry = {
            id : `form-${Math.random().toString(36).substring(2, 12)}`,
            email: req.user.email,
            widgetCount: req.body.formData!.widgetCount,
            submissionDate: new Date().toISOString(),
        }

        let res = await axios.post(`https://sheet.rocks/api/v1/workbook/${workbookID}/sheet/${formSheetID}/append`, {
            Cells: [[newFormEntry!.id, newFormEntry!.email, `${newFormEntry!.widgetCount}`, newFormEntry!.submissionDate]],
        });

        if(res.status !== 200) {
            return {success: false, message: "System error - could not create task"};
        }

        return {success: true};
    }

    if(req.method === "DELETE") {
        if(!req.query.formId) {
            return {success: false, message: "No form id provided"};
        }

        let res = await axios.delete(`https://sheet.rocks/api/v1/workbook/${workbookID}/sheet/${formSheetID}/db/deleteone`, {
            data : {
                MatchFormula: `=COL[A] = "${req.query.formId}"`,
            } 
        });

        if(res.status !== 200) {
            return {success: false, message: "System error - could not delete tasks"};
        }
    }
    
    return {success: false, message: "Invalid method"};
}


const req = JSON.parse(fs.readFileSync('request.json', 'utf8')) as Request;

async function RunMain() {
    let res = await main(req);
    fs.writeFileSync('response.json', JSON.stringify(res));
}

RunMain();

