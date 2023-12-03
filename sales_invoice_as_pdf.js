const distributedData = require("./quanity_distribution_per_user");
const print = require("./print-pdf/pdf_generate")


const getSalesPrintStockAndUserData = async () => {
    let data = await distributedData.distributeAvailablaQuanityPerUser();
    print.printPDF(data.passangerList);
   // console.log(data)
}

getSalesPrintStockAndUserData()
