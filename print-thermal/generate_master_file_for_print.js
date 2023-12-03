const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const _ = require('lodash');

const passangerDetails = excelToJson({
    sourceFile: './input_files_placeholder/airport-passanger-details.xlsx',
    header:{
        rows: 1
    }
});
 
const stock = excelToJson({
    sourceFile: './input_files_placeholder/stock-list-sampnle.xlsx',
    header:{
        rows: 1
    }
});


let passangerSheetKey = Object.keys(passangerDetails);
let passangerList = [];
passangerDetails[passangerSheetKey[0]].forEach( userInfo => {
    passangerList.push({
        'date': userInfo.A,
        'passangerName': userInfo.B,
        'airLine': userInfo.C,
        'boardingPass' : userInfo.D
    })
});

let totalUser = passangerList.length;
if(totalUser === 0){
    console.log('Invalid passanger list. Please ')
}



// fs.writeFile("passanger.json", JSON.stringify(passangerList), function(err) {
//     if(err) {
//         return console.log(err);
//     }
//     console.log("The file was saved!");
// }); 



let stockKeys = Object.keys(stock);
let stockList = [];
let totalQuanity = 0;
stock[stockKeys[0]].forEach( stock => {
    totalQuanity = totalQuanity + Number(stock.B);
    stockList.push({
        'itemName': stock.A,
        'quanity': stock.B,
        'price': stock.C,
    })
});


fs.writeFile("stock.json", JSON.stringify(stockList), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 


// ------------

console.log('Total User', totalUser);
console.log('Total quanity', totalQuanity);
let quanityPerHead = Math.floor(totalQuanity / totalUser);
console.log(quanityPerHead);
console.log(totalUser * .5);
console.log((449 * 6) - 2962)
