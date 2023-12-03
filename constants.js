module.exports.PRINTER_CONFIG = Object.freeze({
    IP:"192.168.1.12",
    PORT: 209
});

module.exports.INPUT_FILE = Object.freeze({
    PASSANGER_LIST:"./input_files_placeholder/airport-passenger-details.xlsx",
    STOCK_LIST: "./input_files_placeholder/stock-list-sample.xlsx"
});

module.exports.OUTPUT_FILE = Object.freeze({
    PASSANGER_LIST:"./output_files/excel_to_json/passenger.json",
    STOCK_LIST: "./output_files/excel_to_json/stock.json",
    PASSANGER_LIST_EXCEL: "./output_files/json_to_excel/passenger.xlsx",
    STOCK_LIST_EXCEL:"./output_files/json_to_excel/stock.xlsx"
});