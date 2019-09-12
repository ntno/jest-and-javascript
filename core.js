'use strict';

const jsonKeyToCsvColumn = {
    'bol_number' : 'BillOfLading',
    'invoice_number' : 'Invoice',
    'itmno' : 'ItemNumber',
    'qty' : 'Quantity'
}

var myFunc = function(fileName, optionalArgument){
    let json = loadFileToObject(fileName);
    let header = Object.values(jsonKeyToCsvColumn);
    let rows = [];

    let bills = json['bills_of_lading'];
    bills.forEach(function(bill){
        let row = [];
        if(bill.bol_number == null){
            throw new Error('missing bol_number')
        }
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

    if(optionalArgument){
        if(optionalArgument.hasOwnProperty('reverse') && optionalArgument['reverse']){
            rows.reverse();
        }
        if(optionalArgument.hasOwnProperty('caps') && optionalArgument['caps']){
            let capitalizedRows = [];
            rows.forEach(function(row){
                capitalizedRows.push(capitalizeItems(row));
            });
            rows = capitalizedRows;
        }
    }

    rows.unshift(header);
    return  createCsv(rows);
}

var capitalizeItems = function(list){
    let capitalized = [];
    list.forEach(function(item){
        if(typeof item == "string"){
            item = item.toUpperCase();
        }
        capitalized.push(item);
    });
    return capitalized;
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