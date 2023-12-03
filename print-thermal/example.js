const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require("node-thermal-printer")


async function example() {
    try {
        const printer = new ThermalPrinter({
            type: PrinterTypes.EPSON, // 'star' or 'epson'
            interface: "tcp://23.2.2.2:9011", // process.argv[2]
            options: {
                timeout: 1000,
            },
            width: 48, // Number of characters in one line - default: 48
            characterSet: CharacterSet.SLOVENIA, // Character set - default: SLOVENIA
            breakLine: BreakLine.WORD, // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
            removeSpecialCharacters: false, // Removes special characters - default: false
            lineCharacter: '-', // Use custom character for drawing lines - default: -
        });
       // console.log('----print object---', printer);
        const isConnected = await printer.isPrinterConnected();
        console.log('Printer connected:', isConnected);

        printer.drawLine();
        printer.alignCenter();
        printer.println('SIGMADUTY FREE SARL')
        printer.alignCenter();
        printer.println('INTERNATIONAL AIRPORT')
        printer.alignCenter();
        printer.table(['IMPO NO#', 'A1813997K']);
        printer.table(['CELL NO', '+243 849 023 539']);
        printer.drawLine();
        printer.newLine();
        printer.alignLeft();
        printer.newLine();
        printer.println('Hello World!');
        printer.println('This is a long line that will be collapsed into two lines');
        printer.drawLine();

        printer.upsideDown(true);
        printer.println('Hello World upside down!');
        printer.upsideDown(false);
        printer.drawLine();

        printer.invert(true);
        printer.println('Hello World inverted!');
        printer.invert(false);
        printer.drawLine();

        printer.println('Special characters: ČčŠšŽžĐđĆćßẞöÖÄäüÜé');
        printer.drawLine();

        printer.setTypeFontB();
        printer.println('Type font B');
        printer.setTypeFontA();
        printer.println('Type font A');
        printer.drawLine();

        printer.alignLeft();
        printer.println('This text is on the left');
        printer.alignCenter();
        printer.println('This text is in the middle');
        printer.alignRight();
        printer.println('This text is on the right');
        printer.alignLeft();
        printer.drawLine();

        printer.setTextDoubleHeight();
        printer.println('This is double height');
        printer.setTextDoubleWidth();
        printer.println('This is double width');
        printer.setTextQuadArea();
        printer.println('This is quad');
        printer.setTextSize(7, 7);
        printer.println('Wow');
        printer.setTextSize(0, 0);
        printer.setTextNormal();
        printer.println('This is normal');
        printer.drawLine();

        try {
            printer.printBarcode('4126570807191');
            printer.code128('4126570807191', {
                height: 50,
                text: 1,
            });
            printer.beep();
        } catch (error) {
            console.error(error);
        }

        printer.pdf417('4126565129008670807191');
        printer.printQR('https://olaii.com');

        printer.newLine();

        printer.leftRight('Left', 'Right');

        printer.table(['One', 'Two', 'Three', 'Four']);
        printer.table(['col1', 'col2', 'col3', 'col4']);

        printer.tableCustom([
            { text: 'Left', align: 'LEFT', width: 0.5 },
            {
                text: 'Center', align: 'CENTER', width: 0.25, bold: true,
            },
            { text: 'Right', align: 'RIGHT', width: 0.25 },
        ]);

        printer.tableCustom([
            { text: 'Left', align: 'LEFT', cols: 8 },
            {
                text: 'Center', align: 'CENTER', cols: 10, bold: true,
            },
            { text: 'Right', align: 'RIGHT', cols: 10 },
        ]);

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

example();