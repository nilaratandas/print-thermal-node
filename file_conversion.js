const excelToJson = require('convert-excel-to-json');
const XLSX = require('xlsx');
const fs = require('fs');

const logger = require('./logger/logger');

/**
 * 
 * @param {*} file 
 * @returns 
 */
module.exports.convertExcelToJson = async (file) => {
    const convertedJsonData = excelToJson({
        sourceFile: file,
        header: {
            rows: 1
        }
    });

    return convertedJsonData;
}

/**
 * 
 * @param {*} file 
 * @param {*} jsonData 
 */
module.exports.writeJsonToFile = async (file, jsonData) => {
    return new Promise(function (resolve, reject) {
        fs.writeFile(require.resolve(file), JSON.stringify(jsonData), function (err) {
            if (err) reject({ "success": false });
            else resolve({ "success": true });
        });
    });
}

/**
 * 
 * @param {*} data 
 * @param {*} workSheetName 
 * @param {*} fileName 
 * @returns 
 */
module.exports.convertJsonToExcel = async (data, workSheetName, fileName) => {
    try {
        const workSheet = XLSX.utils.json_to_sheet(data);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, workSheetName);
        // Generate buffer
        XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" });
        // Binary string
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
        XLSX.writeFile(workBook, fileName);
        return { status: true, message: "JSON to Excel converted Sucessfully" };
    } catch (error) {
        return { status: false, message: error }
    }
}