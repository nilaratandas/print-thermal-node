const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require("node-thermal-printer")
const electron = typeof process !== 'undefined' && process.versions && !!process.versions.electron;
const { PRINTER_CONFIG } = require("./constants")

console.log(electron);

async function printSample() {
  try {
    let printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: 'printer:My Printer',
      driver: require(electron ? 'electron-printer' : 'printer')
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
    console.error("Print Error Handled:", error);
  }
}

printSample();