const distributedData = require("./quanity_distribution_per_user");
const print = require("./print-thermal/print-sales-recepits")


const getSalesPrintStockAndUserData = async () => {
    let data = await distributedData.distributeAvailablaQuanityPerUser();
    print.printReceipts(data.passangerList);
}

getSalesPrintStockAndUserData()
