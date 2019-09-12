'use strict';

const header = ['BillOfLading', 'Invoice', 'ItemNumber', 'Quantity'];

var myFunc = function(fileName, optionalArgument){
    let json = loadFileToObject(fileName);
    let rows = [];

    
    //for each bill in the list
    let bills = json.bills_of_lading;
    bills.forEach(function(bill){
        if(bill.bol_number == null){
            throw new Error('missing bol_number')
        }

        let row = [];
        row.push(bill.bol_number);

        //for each invoice in the bill
        let invoices = bill.invoices;
        invoices.forEach(function(invoice){
            //if not the first invoice in the list
            //strip out the details for the previous invoice 
            //(ie everything after the bill of lading number)
            if(row.length > 1){
                row = row.slice(0, 1);
            }
            row.push(invoice.invoice_number);

            //for each item in the invoice
            let items = invoice.items;
            items.forEach(function(item){
                //if not the first item in the invoice
                //strip out the details for the previous items 
                //(ie everything after the invoice number)
                if(row.length > 2){
                    row = row.slice(0, 2);
                }
                row.push(item.itmno);
                row.push(item.qty);
                rows.push(row);
            });

        });
      });

    if(hasReverseFlag(optionalArgument)){
        rows.reverse();
    }

    if(hasCapitalizeFlag(optionalArgument)){
        let capitalizedRows = [];
        rows.forEach(function(row){
            capitalizedRows.push(capitalizeItems(row));
        });
        rows = capitalizedRows;
    }
    
    //insert header at beginning of array
    rows.unshift(header);
    return  createCsv(rows);
}

var hasReverseFlag = function(options){
    return options && options.hasOwnProperty('reverse') && options['reverse'];
}

var hasCapitalizeFlag = function(options){
    return options && options.hasOwnProperty('caps') && options['caps'];
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

var createCsvRow = function(list){
    return list.join(',');
}

var createCsv = function(twoDimensionalList){
    let csvAsString = '';
    twoDimensionalList.forEach(function(list){
        csvAsString = csvAsString.concat(createCsvRow(list), '\n');
    });
    return csvAsString;
}

//export public functions
module.exports = {
    myFunc : myFunc
  }