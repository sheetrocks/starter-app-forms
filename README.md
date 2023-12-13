# SheetRocks Starter App (With Form Submission!)

This repository provides an example of how to make a spreadsheet-backed SheetRocks app for your team to report the number of widgets they produced in a day. The contents of the reporting / form submission can be adapted to your use case. Examples include timecard submission, revenue reporting, lead reporting, etc.

## App Features
This app demonstrates several core capabilities of the SheetRocks platform:
1. Authentication -- our pattern for secure token-based authentication can be found in index.tsx and login.tsx
2. Creating, Reading, Updating, and Deleting Data: our pattern for CRUD operations can be found in index.tsx, form.tsx, and form.ts
3. Backend Analytics: After reporting data, the admin can keep track of widget production performance with always-updated analytics on the dashboard.

### Getting Started
1. Run the following command to download and unzip the project, rename the project to "myapp", and initialize the frontend and backend environment files.
```bash
wget https://github.com/sheetrocks/starter-app-forms/archive/refs/heads/main.zip && unzip main.zip && mv starter-app-forms-main myapp && cd myapp && mv .example.env .env && mv api/example.env.ts api/env.ts
```
2. Now you'll need to enter the correct environment variables in the files you just created. Visit [SheetRocks](https://sheet.rocks/home) and create a new workbook. Then, get the API Key, Workbook ID, User Sheet ID, and Root URL (optional) from the workbook using the video instructions [here](https://www.loom.com/share/5ba840b300184759a71a4f4b55f54eaa). Additionally, you'll need to create a "Forms" sheet, and give it a header for id, submitterEmail, widgetCount, and submissionDate (in that order).
```
sed -i -e 's/{SHEETROCKS_API_KEY}/(Your API Key)/' -e 's/{WORKBOOK_ID}/(Your Workbook ID)/' -e 's/{USER_SHEET_ID}/(Your User Sheet ID)/' -e 's/{FORM_SHEET_ID}/(Your Form Sheet ID)/' -e 's/{CUSTOM_DOMAIN}/(Your Custom Domain)/' .env api/env.ts
```
3. Then run this command to install dependencies, compile the files, and deploy to SheetRocks.
```bash
npm ci && npm run build && node deploy.js
```
4. **Dashboard**: Optionally, you can create a simple dashboard to keep track of your team's analytics. We'll make some simple analytics to tally up the top widget producers on your team. Create a Dashboard tab in the workbook, and give it a header of email and widgetCount (in cells A1 and B1). Then, in cell A2, enter this formula:  `=FILTER(SORT(GROUPBY(Forms!A:D, "submitterEmail", "widgetCount", SUM(GROUP)),2,-1), NOT(ISBLANK(COL[1])))`. This formula shows how to aggregate, sort, and filter data in SheetRocks using the [GROUPBY](https://sheet.rocks/formulas/groupby), [SORT](https://sheet.rocks/formulas/sort), and [FILTER](https://sheet.rocks/formulas/filter) formulas.

That's it! Now you have a basic SheetRocks app with authentication, CRUD operations, and backend analytics. If you'd like help adapting it to your use case, don't hesitate to reach out.



