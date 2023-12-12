const _ = require('lodash');

const logger = require('./logger/logger');
const fileConversion = require('./file_conversion');


const { INPUT_FILE, OUTPUT_FILE } = require('./constants');

let MAX_QTY = 3;
let MIN_QTY = 1; 1
var updateStock = [];
var MAX_QTY_PER_USER = 4;

/**
 * Converting passenger list excel to json  
 * @returns 
 */
const convertPassenserDataToJson = async () => {
    const passangerDetails = await fileConversion.convertExcelToJson(INPUT_FILE.PASSANGER_LIST);
    let passangerSheetKey = Object.keys(passangerDetails);
    let passangerList = [];
    for (passangerInfo of passangerDetails[passangerSheetKey[0]]) {
        if (passangerList.indexOf(passangerInfo.B) === -1) {
            passangerList.push({
                'date': passangerInfo.A,
                'passangerName': passangerInfo.B,
                'airLine': passangerInfo.C,
                'boardingPass': passangerInfo.D
            });
        } else {
            logger.info("duplicate name found in passenger list : ", passangerInfo.B);
            return { "success": false, "message": "Duplicate Passenger Name found" };
        }
    }

    let totalUser = passangerList.length;
    if (totalUser === 0) {
        logger.info(`Invalid passanger file . Please upload the valid file and continue`);
        return { "success": false, "message": "No passenger data found, please double check the uploaded file" }
    }

    let createFileResult = await fileConversion.writeJsonToFile(OUTPUT_FILE.PASSANGER_LIST, passangerList);
    return createFileResult.success ? { "success": true, data: passangerList } : { "success": false, "message": "Fail during creating passenger json file" }
}

/**
 * 
 */
const convertStocrDataToJson = async () => {
    const stock = await fileConversion.convertExcelToJson(INPUT_FILE.STOCK_LIST);
    let stockKeys = Object.keys(stock);
    let stockList = [];

    for (stockData of stock[stockKeys[0]]) {
        if (stockList.indexOf(stockData.BA === -1)) {
            stockList.push({
                'itemName': stockData.A,
                'quanity': stockData.B,
                'price': stockData.C,
            })
        } else {
            logger.info("duplicate name found in passenger list : ", passangerInfo.B);
            return { "success": false, "message": "Duplicate Stock found" };
        }
    }

    let createFileResult = await fileConversion.writeJsonToFile(OUTPUT_FILE.STOCK_LIST, stockList);
    return createFileResult.success ? { "success": true, data: stockList } : { "success": false, "message": "Fail during creating Stock json file" }

}

function pickQtyfromStockList(maxQtyPerUser, quantityPerUser) {
    MAX_QTY = quantityPerUser <= MAX_QTY ? quantityPerUser : MAX_QTY;
    let summingSubsets = [];
    //  Calculate all combination that add up to the quanityPerUser by maxQtyPerBrand
    findCombinationSumByMaxQty(quantityPerUser, MAX_QTY, counter = 0, summingSubsets);
    if (maxQtyPerUser.every(maxQty => maxQty.quanity >= MAX_QTY)) {
        return summingSubsets;
    } else if (maxQtyPerUser.every(maxQty => maxQty.quanity == MIN_QTY)) {
        let sumingSubsetByOne = [];
        findCombinationSumByMaxQty(quantityPerUser, MIN_QTY, counter = 0, sumingSubsetByOne);
        return sumingSubsetByOne;
    } else {

        let increment = 0;
        let newSumSubnet = [];
        for (sumSubnet of summingSubsets) {
            logger.info('sumsubnet', sumSubnet)
            if (maxQtyPerUser[increment]['quanity'] >= MAX_QTY) {
                newSumSubnet.push(sumSubnet);
            } else {
                if (maxQtyPerUser[increment]['quanity'] != 0) {
                    let explandSummingSubnets = [];
                    if (sumSubnet != MIN_QTY) {
                        findCombinationSumByMaxQty(sumSubnet, maxQtyPerUser[increment]['quanity'], counter = 0, explandSummingSubnets);
                        logger.info('---- findCombinationSumByMaxQty ----', summingSubsets, explandSummingSubnets)
                    } else {
                        explandSummingSubnets.push(sumSubnet)
                    }
                    newSumSubnet = [...newSumSubnet, ...explandSummingSubnets];
                }
            }

            increment = increment + 1;
        }
        newSumSubnet.sort(function (a, b) { return b - a; });

        return newSumSubnet;
    }
}

/**
 * 
Step1: Calculate all combination that add up to the quanityPerUser by maxQtyPerBrand
    Example : 
        quanityPerUser = 10
        maxQtyPerBrand = 3
        sum = 3, 3, 3,1 

        quanityPerUser = 7
        maxQtyPerBrand = 3
        sum = 3,3,1

        quanityPerUser = 5
        maxQtyPerBrand = 3
        sum = 3,2

        quanityPerUser = 4
        maxQtyPerBrand = 3
        sum = 3,1

 * @param {*} quantityPerUser 
 * @param {*} maxQty 
 * @param {*} counter 
 * @param {*} summingSubsets 
 */
function findCombinationSumByMaxQty(quantityPerUser, maxQty, counter, summingSubsets) { // aviod -> dynamic programing
    counter = counter + maxQty;
    summingSubsets.push(maxQty);

    if ((quantityPerUser - counter) < maxQty && (quantityPerUser - counter) != 0) {
        summingSubsets.push((quantityPerUser - counter));
        counter = counter + (quantityPerUser - counter);
    }

    if (counter != quantityPerUser) {
        findCombinationSumByMaxQty(quantityPerUser, maxQty, counter, summingSubsets);
    }
}


function getPersonalisedItems(maxStockPerUser, personalisedAvailabeQty, stocknew) {
    let getQuanityForUser = [];
    let counter = 0;
    logger.info("== getPersonalisedItems() == ", maxStockPerUser.map(s => s.quanity), personalisedAvailabeQty);
    for (userStock of maxStockPerUser) {
        let refreshStock = {};
        if (personalisedAvailabeQty[counter] == undefined) break;
        getQuanityForUser.push(
            {
                "itemName": `${userStock.itemName}-${personalisedAvailabeQty[counter]}_${userStock.price}`,
                'catName': userStock.itemName,
                'quantity': personalisedAvailabeQty[counter],
                'rates':userStock.price,
                'amount': parseInt(personalisedAvailabeQty[counter]) * parseInt(userStock.price)
            }
        );
        let updateStockIndex = stocknew.findIndex((stock => stock.itemName == userStock.itemName && stock.price == userStock.price && stock.quanity == userStock.quanity));
        refreshStock.itemName = stocknew[updateStockIndex]["itemName"];
        refreshStock.updateBefore = stocknew[updateStockIndex]["quanity"];
        refreshStock.personalisedAvailabeQty = personalisedAvailabeQty[counter];
        refreshStock.quanity = maxStockPerUser.map(sd => sd.quanity);
        stocknew[updateStockIndex]["quanity"] = stocknew[updateStockIndex].quanity - personalisedAvailabeQty[counter];
        refreshStock.updateAfter = stocknew[updateStockIndex]["quanity"];
        counter = counter + 1;
        updateStock.push(refreshStock)
        logger.info("-------- refreshStock ----------", refreshStock);
    }

    return getQuanityForUser;
}

async function getConvertedJsonData() {
    return new Promise((resolve, reject) => {
        let promises = [
            convertPassenserDataToJson(),
            convertStocrDataToJson()
        ]

        Promise.all(promises)
            .then((results) => {
                resolve({ "status": true, "passenger": results[0], "stock": results[1] });
            }).catch((error) => {
                console.log('error', error)
                reject({ "status": false, 'errorMsg': 'error during convert the passanger and stock list to json data' });
            });
    })
}

async function distributeStockPerUser() {
    logger.info(`================================New Print Request at : ${new Date()}===================================`)
    try {
        let passangerList = [];
        let stockList = [];
        let convertedJsonData = await getConvertedJsonData();

        if (convertedJsonData.status) {
            if (convertedJsonData.passenger.success) {
                passangerList = convertedJsonData.passenger.data;
            } else {
                console.log("Error during parsing pessenger list");
                return;
            }

            if (convertedJsonData.stock.success) {
                stockList = convertedJsonData.stock.data;
                stockList.pop();
            } else {
                console.log("Error during parsing stock list");
                return;
            }
        }

        let totalQuanity = 0;
        stockList.forEach(stock => {
            totalQuanity = totalQuanity + stock.quanity;
        })
        let totalUser = passangerList.length;
        let calculateQuanity = totalQuanity / totalUser;
        //calculate the quanity per user 
        let quantityPerUser = Math.floor(calculateQuanity);
        //Evaluate the extra quanity       
        let extraQuantity = (totalQuanity - (totalUser * quantityPerUser));
        logger.info(`total user : ${totalUser}, total quanity : ${totalQuanity}, quanity per user : ${quantityPerUser} , total quanity for users : ${(totalUser * quantityPerUser)}  extra quanity : ${extraQuantity}`);
        console.log(`total user : ${totalUser}, total quanity : ${totalQuanity}, quanity per user : ${quantityPerUser} , total quanity for users : ${(totalUser * quantityPerUser)}  extra quanity : ${extraQuantity}`);
        let discount = [0, 5, 10];
        if(quantityPerUser > MAX_QTY_PER_USER){
            quantityPerUser = MAX_QTY_PER_USER;
            extraQuantity = 0;
        }
        for (userInfo of passangerList) {
            // Sort the stock list by quanity in descending order
            let descQuanityStockList = _.orderBy(stockList, ['quanity'], ['desc']);
            // Add extra quanity unitil its exhusted
            let quantityPerUserWithExtra = extraQuantity != 0 || extraQuantity > 0 ? quantityPerUser + 1 : quantityPerUser;

            // Get list of brand the numbers will be matched with quanityPerUser and it holds highest quanity
            let maxStockPerUser = _.take(descQuanityStockList, quantityPerUserWithExtra);

            if (maxStockPerUser.every(msp => msp.quanity != 0)) {
                let personalisedAvailabeQty = pickQtyfromStockList(maxStockPerUser, quantityPerUserWithExtra);
                // Get the item details based on personalisedAvailabeQty
                let releasedStockPerUser = getPersonalisedItems(maxStockPerUser, personalisedAvailabeQty, stockList)
                //Reduce the extraquanity by 1 once its exhusted

                userInfo.itemName = releasedStockPerUser.map(rsp => { return rsp.itemName }).join("&");
                userInfo.stock = releasedStockPerUser;
                userInfo.quantityPerUser = quantityPerUser;
                userInfo.extraQuantity = extraQuantity != 0 ? 1 : 0;
                userInfo.billNo = Math.floor(1000 + Math.random() * 9000);
                let totAmt = releasedStockPerUser.reduce((sum, stockItem) => sum + stockItem.amount, 0);
                userInfo.totalAmount = totAmt.toFixed(2);
                userInfo.discount = _.sample(discount).toFixed(2);
                userInfo.payableAmount = discount === 0 ? userInfo.totalAmount : (userInfo.totalAmount - (userInfo.totalAmount) * (userInfo.discount / 100)).toFixed(2);
                if (extraQuantity != 0) {
                    extraQuantity = extraQuantity - 1;
                }

            }
        }
        return { passangerList, stockList };

    } catch (error) {
        console.log('error', error);
    }

}

/**
 *      "date": "2023-01-03T18:29:50.000Z",
        "passangerName": "GOVINDA PILLAI",
        "airLine": "ASKY",
        "boardingPass": "0026",
        "itemName": "KING ROBERT WHISKY 75CL-3_20",
        "stock": [
            {
                "itemName": "KING ROBERT WHISKY 75CL-3_20",
                "catName": "KING ROBERT WHISKY 75CL",
                "quantity": 3,
                "rates": 20,
                "amount": 60
            }
        ],
        "quantityPerUser": 2,
        "extraQuantity": 1,
        "billNo": 9727,
        "totalAmount": 60,
        "discount": 0,
        "payableAmount": "60.00",
        "counter": 0
 * @returns 
 */
module.exports.distributeAvailablaQuanityPerUser = async () => {
    try{
        let result = await distributeStockPerUser();
        let pListForExcel = _.cloneDeep(result.passangerList);
        for(plist of pListForExcel){
            delete plist['stock'];
            delete plist['counter'];
        }
        await fileConversion.convertJsonToExcel(pListForExcel, "passenger-list", OUTPUT_FILE.PASSANGER_LIST_EXCEL);
        await fileConversion.convertJsonToExcel(result.stockList, "stock-list", OUTPUT_FILE.STOCK_LIST_EXCEL);
        return result;
    }catch(error){
        return error;
    }

}