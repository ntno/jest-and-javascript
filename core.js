'use strict';

const jsonKeyToCsvColumn = {
    'bol_number' : 'BillOfLading',
    'invoice_number' : 'Invoice',
    'itmno' : 'ItemNumber',
    'qty' : 'Quantity'
}

var myFunc = function(fileName, optionalArgument){
    let json = loadFileToObject(fileName);
    let bills = json['bills_of_lading'];

    let rows = [];
    rows.push(Object.values(jsonKeyToCsvColumn));
    bills.forEach(function(bill){
        let row = [];
        row.push(bill.bol_number);
        let invoices = bill.invoices;
        invoices.forEach(function(invoice){
            if(row.length > 1){
                row = row.slice(0, 1);
            }
            row.push(invoice.invoice_number);
            let items = invoice.items;
            items.forEach(function(item){
                if(row.length > 2){
                    row = row.slice(0, 2);
                }
                row.push(item.itmno);
                row.push(item.qty);
                rows.push(row);
            });

        });
      });
    return  createCsv(rows);
}

var loadFileToObject = function(fileName){
    let json = require(fileName);
    return json;
}

var createCsvRow = function(...list){
    return list.join(',');
}

var createCsv = function(twoDimensionalList){
    let csvAsString = '';
    for(let i = 0; i < twoDimensionalList.length; i++) {
        csvAsString = csvAsString.concat(createCsvRow(twoDimensionalList[i]), '\n');
    }
    return csvAsString;
}

//export public functions
module.exports = {
    myFunc : myFunc
  }