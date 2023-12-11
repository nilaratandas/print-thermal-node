const pdf = require("pdf-creator-node");
const fs = require("fs");

var html = fs.readFileSync(require.resolve("./template.html"), "utf8");

/**
 * Generate Sales Invoice as themal print as PDF
 * @param {*} printData 
 */
module.exports.printPDF = (printData) => {

    let index = 0;
    for (passenger of printData) {
        passenger['counter'] = index % 2;
        let date = new Date(passenger['date']);
        if (date != 'Invalid Date') {
            let dd = date.getDate();
            dd = (dd.toString().length === 1 ? "0" + dd : dd);
            let mm = date.getMonth() + 1;
            mm = (mm.toString().length === 1 ? "0" + mm : mm);
            let yyyy = date.getFullYear();
            yyyy = yyyy.toString().substr(2, 4);
            passenger['date'] = dd + "/" + mm + "/" + yyyy;
        }
        index++;
    }

    let timestamp = this.getCurrentTimeStamp();

    var options = {
        format: "A4",
        // orientation: "portrait",
        border: "5mm",
        header: {
            height: "2mm",
        },
        footer: {
            height: "2mm",
            // contents: {
            //     first: 'Cover page',
            //     2: 'Second page', // Any page number is working. 1-based index
            //     default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            //     last: 'Last Page'
            // }
        }
    };

    var document = {
        html: html,
        data: {
            users: printData,
        },
        path: `./output_files/pdf/sales_invoice_${timestamp}.pdf`,
        type: "",
    };

    pdf.create(document, options)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.error(error);
        });
}


/**
 * Get current timestamp
 */
module.exports.getCurrentTimeStamp = () => {
    var currentdate = new Date();
    return `${currentdate.getDate()}-${(currentdate.getMonth() + 1)}-${currentdate.getFullYear()}_${currentdate.getHours()}_${currentdate.getMinutes()}_${currentdate.getSeconds()}_${currentdate.getMilliseconds()}`;
}