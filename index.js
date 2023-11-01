const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const { PRINTER_CONFIG } = require("./constants")

const electron = typeof process !== 'undefined' && process.versions && !!process.versions.electron;
console.log('----electron----', electron);
async function printSample() {
  try {
    let printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: `tcp://${PRINTER_CONFIG.IP}:${PRINTER_CONFIG.PORT}`
    });
    console.log(`Printer IP ${PRINTER_CONFIG.IP}: and Port is : ${PRINTER_CONFIG.PORT}`);
    let printerStatus = await printer.isPrinterConnected();

    console.log("Printer Connection Status is :", printerStatus);
    printer.alignCenter();
    printer.drawLine();
    printer.println("Hello world with TCP");
    printer.drawLine();
    console.log("------- Print Priview in Console -------\n", printer.getText());
    printer.cut();
    try {
      let execute = printer.execute()
      console.log("Print done!");
    } catch (error) {
      console.error("Print failed:", error);
    }
  } catch (error) {
    console.error("Print failed:", error);
  }
}

printSample();