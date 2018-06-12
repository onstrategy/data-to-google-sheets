function getGoals() {
    var options = {
        "contentType": "application/json",
        "headers": {
            "Accept": "application/json",
            "Authorization": "Bearer <TOKEN>"
        }
    }
    var response = UrlFetchApp.fetch("https://api.onstrategyhq.com/api/goals_detail.json?key=YOUR_API_KEY", options);
    // The API key here is crucial, it determines the plan from which goals are being pulled. Example: ?key=YOUR_API_KEY
    // You can find your API key by logging into your OnStrategy plan and navigating to this URL: https://app.mystrategicplan.com/account/api_keys
    // To select a specific FY, change ?key=YOUR_API_KEY (example key) to ?fiscal_year=2018&key=YOUR_API_KEY (example key)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var sheet = ss.getSheetByName("Sheet1"); // Enter the specific sheet name here "Sheet1" is default with a new sheet

    var dataGOALS = JSON.parse(response.getContentText()); //
    var dataSet = dataGOALS.data; // Adding ".data" brings the multidimensional array down one level


    //title rows
    var title = [];
    title.push(["Goal ID", "Item Name", "Goal Number", "Last Updated", "Start Date", "End Date", "Measure", "EOY Target",
        "YTD Actual", "KPI?", "Tracking Frequency", "Target Direction", "Target Type", "Priority", "Status", "Owner", "Contributors", "Performance Info", "Comments"]);
    dataRange = sheet.getRange(1, 1, 1, 19);
    dataRange.setValues(title);

    var rows = [],
        data;


    for (i = 0; i < dataSet.length; i++) { // controls the number of iterations through the loop
        data = dataSet[i];

        if (data.target === null) {
            data.target = "Not Set"
        } // For goals without a target, this prevents an error in the data
        if (data.when_updated === null) {
            data.when_updated = "Not Set"
        } // Removes the data key from the sheet if the data is null
        if (data.start_date === null) {
            data.start_date = "Not Set"
        } // Removes the data key from the sheet if the data is null
        if (data.end_date === null) {
            data.end_date = "Not Set"
        } // Removes the data key from the sheet if the data is null
        if (data.measure === "") {
            data.measure = "Not Set"
        } // Removes the data key from the sheet if the data is null
        if (data.ytd === null) {
            data.ytd = "Not Set"
        } // Removes the data key from the sheet if the data is null
        if (data.tracking_frequency === null) {
            data.tracking_frequency = "Not Set"
        } // Removes the data key from the sheet if the data is null
        if (data.target_type === "") {
            data.target_type = "Not Set"
        } // Removes the data key from the sheet if the data is null
        if (data.priority === "") {
            data.priority = "Not Set"
        } // Removes the data key from the sheet if the data is null
        if (data.status_icon === null) {
            data.status_icon = "Not Set"
        } // Removes the data key from the sheet if the data is null
        if (data.is_key === "0") {
            data.is_key = "No"
        } // No if goal is not a KPI
        if (data.is_key === "1") {
            data.is_key = "Yes"
        } // Yes if goal is a KPI
        var conts = "";
        if (data.contributors !== null) {
            var contData = data.contributors;
            var arrayLengthC = Object(contData).length;
            for (j = 0; j < arrayLengthC; j++) { // controls the number of iterations through the loop
                var dataC = contData[j];
                if (conts === null) {
                    conts = dataC + "\r\n"
                } else {
                    conts = conts + dataC + "\r\n"
                }
            }
        }
        var perfinfo = "";
        if (data.performance_info !== null) {
            var perfData = data.performance_info;
            var arrayLengthP = Object(perfData).length;
            for (k = 0; k < arrayLengthP; k++) { // controls the number of iterations through the loop
                var dataP = perfData[k];
                if (perfinfo === null) {
                    perfinfo = "Date: " + dataP.date + "; Actual: " + dataP.actual + "; Target: " + dataP.target + "\r\n"
                } else {
                    perfinfo = perfinfo + "Date: " + dataP.date + "; Actual: " + dataP.actual + "; Target: " + dataP.target + "\r\n"
                }
            }
        }
        if (data.level === "0") {
            data.start_date = "N/A", data.end_date = "N/A", data.measure = "N/A", data.tracking_frequency = "N/A",
                data.priority = "N/A", data.target_type = "N/A", data.status_icon = "N/A", data.ytd = "N/A", data.when_updated = "N/A", data.target.target = "N/A"
        } // Removes the data keys that are not applicable for [level=0 goals] (strategic objectives)
        rows.push([data.id, data.item, data.number, data.when_updated, data.start_date, data.end_date, data.measure, data.target.target,
        data.ytd, data.is_key, data.tracking_frequency, data.target_direction, data.target_type, data.priority, data.status_icon, data.owner.name, conts, perfinfo, data.comments]) // Named JSON entities used in the sheet
    }

    // [row to start on], [column to start on], [number of rows], [number of entities]
    dataRange = sheet.getRange(2, 1, rows.length, 19);
    dataRange.setValues(rows);

}
