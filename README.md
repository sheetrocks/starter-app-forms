# SheetRocks Starter App

This repository provides everything you need to start a new app on SheetRocks, the platform for building spreadsheet-backed apps.

### Prerequisites
You'll need to have the latest LTS release of nodejs setup on your local machine.

### Getting Started
1. Run the following command to download and unzip the project, rename the project to "myapp", and initialize the frontend and backend environment files.
```bash
wget https://github.com/sheetrocks/starter-app/archive/refs/heads/main.zip && unzip main.zip && mv starter-app-main myapp && cd myapp && mv .example.env .env && mv api/example.env.ts api/env.ts
```
2. Now you'll need to enter the correct environment variables in the files you just created. Visit [SheetRocks](https://sheet.rocks/home) and create a new workbook. Then, get the API Key, Workbook ID, User Sheet ID, and Root URL (optional) from the workbook using the video instructions [here](https://www.loom.com/share/5ba840b300184759a71a4f4b55f54eaa).
```
sed -i -e 's/{SHEETROCKS_API_KEY}/(Your API Key)/' -e 's/{WORKBOOK_ID}/(Your Workbook ID)/' -e 's/{USER_SHEET_ID}/(Your User Sheet ID)/' -e 's/{CUSTOM_DOMAIN}/(Your Custom Domain)/' .env api/env.ts
```
3. Then run this command to install dependencies, compile the files, and deploy to SheetRocks.
```bash
npm ci && npm run build && node deploy.js
```

That's it! If the deploy was successful, it will shower you with praise and give you the link for your app.

