const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const {PRINTER_CONFIG} = require("./constants")

let printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: `tcp://${PRINTER_CONFIG.IP}:${PRINTER_CONFIG.PORT}`
});

console.log(`Printer IP ${PRINTER_CONFIG.IP}: and Port is : ${PRINTER_CONFIG.PORT}`);

const isPrinterConnected = async () => {
    return await printer.isPrinterConnected();
}


const prnitProcess = async () => {
    try {
        let execute = printer.execute()
        console.log("Print done!");
      } catch (error) {
        console.error("Print failed:", error);
      }
}



isPrinterConnected().then(function (printerStatus){
    console.log("Printer Connection Status is :", printerStatus );
    if(printerStatus){
        printer.alignCenter();
        printer.println("Hello world with TCP");
        printer.cut();
        prnitProcess();
    }
});




