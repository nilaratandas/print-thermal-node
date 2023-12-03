const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require("node-thermal-printer")
const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON, // 'star' or 'epson'
    interface: "tcp://23.2.2.2:9011", // process.argv[2]
    options: {
        timeout: 1000,
    },
    width: 48, // Number of characters in one line - default: 48
    characterSet: CharacterSet.SLOVENIA, // Character set - default: SLOVENIA
    breakLine: BreakLine.CHARACTER, // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
    removeSpecialCharacters: false, // Removes special characters - default: false
    lineCharacter: '-', // Use custom character for drawing lines - default: -
});

module.exports.printReceipts = async () => {
    try {
        const isConnected = await printer.isPrinterConnected();
        console.log('Printer connected:', isConnected);

        // Template header
        printer.alignCenter();
        printer.println('SIGMADUTY FREE SARL')
        printer.alignLeft();
        printer.table(['IMPO NO#', 'A1813997K']);
        printer.table(['CELL NO', '+243 849 023 539']);
        printer.newLine();
        printer.drawLine();

        // Sub Heading in center alinged
        printer.alignCenter();
        printer.println('DR CONGO');
        printer.drawLine();
        printer.println('FACTURE / INVOICE');
        printer.drawLine();
        printer.newLine();

        // Passanger Details
        printer.alignLeft();
        printer.table(['DATE', '10/02/23']);
        printer.table(['BILL NO', '2332']);
        printer.table(['CUST. NAME', 'Manish asdfa asdf asdf asdf asd f']);
        printer.table(['BOAD. PASS NO', '0026']);
        printer.table(['AIR LINE', 'ASKY']);
        printer.drawLine();

        // Item Name and Quanity Section
        printer.alignLeft();
        printer.table(['ITEM NAME', 'QTY', 'RATE$', 'AMOUT$']);
        printer.table(['ABSOLUT 1L', '2', '30', '60']);
        printer.table(['BLACK DE LUX 75CL 1L', '2', '30', '60']);
        printer.table(['NEDERBURG THE MANOR HOUSSE 75CL', '2', '30', '60']);
        printer.drawLine();


        // Amount section 
        printer.alignLeft();
        printer.table(['TOTAL AMOUNT', '$180']);
        printer.table(['DISCOUNT', '$0.00']);
        printer.table(['PAYABLE AMOUNT', '$180.00']);
        printer.table(['CASH', '$180.00']);
        printer.table(['CARD', '$0.00']);

        // Footer section
        printer.newLine();
        printer.newLine();
        printer.newLine();
        printer.newLine();
        printer.alignCenter();
        printer.setTypeFontB();
        printer.println('Thank you for shopping at Sigma Duty Free');
        printer.println('No return or refund or exchange Allowed');

        printer.cut();
        printer.openCashDrawer();

        console.log("------- Print Priview in Console -------\n", printer.getText());

        try {
            await printer.execute();
            console.log('Print success.');
        } catch (error) {
            console.error('Print error:', error);
        }
    } catch (error) {
        console.error("----Error handled ---", error);
    }
}