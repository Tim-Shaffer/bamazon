// -------------  TRYING TO KEEP THE WARNING MESSAGE FROM DISPLAYING ------------
require('events').EventEmitter.defaultMaxListeners = 0;
// --------------------------------------------------------------------------------------

// code to read and set any environment variables with the .env package 
require("dotenv").config();

//variable for the mysql package
var mysql = require("mysql");

//variable for the inquirer package
var inquirer = require("inquirer");

//variable for the console.table package
require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user:  process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "bamazon"
});

// define an array to hold item ids for validation of the item to purchase
var validItemArray = [];

// define variables for the inquirer questions to be asked
var customerSelect = [{
        name: "item_id",
        message: "Enter the ID of the item you would like to buy [Q to Quit]",
        validate: function (value) {
            if (value.toLowerCase() === 'q') {
                endCustomer();
            } else if (validItemArray.indexOf(parseInt(value)) !== -1) {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        name: "qty",
        message: "How many would you like to purchase? [Q to Quit]",
        validate: function (value) {
            if (value.toLowerCase() === 'q') {
                endCustomer();
            } else if (parseInt(value) > 0) {
                return true;
            } else {
                return false;
            }
        }
    }];

// global variables for Product information
var productID;
var qtyToPurchase;

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;

    // display all the products available for sale upon successful connection to the database
    getAllProducts();

});

// --------------------------------------------------------------------------------------
//  function to query the db and display all the available products 
// --------------------------------------------------------------------------------------
function getAllProducts() {

    connection.query("SELECT * FROM products ORDER BY item_id", function(err, res) {
        
        if (err) throw err;
        
        let productsArray = [];
        
        let tableJSON;
        
        for (var i = 0; i < res.length; i++) {
        
            tableJSON = {
                "ID": res[i].item_id,
                "Product": res[i].product_name,
                "Department": res[i].department_name,
                "Price": res[i].price.toFixed(2),
                "Quantity in Stock": res[i].stock_quantity
            }
        
            productsArray.push(tableJSON);

            validItemArray.push(res[i].item_id);
        
        };

        console.log("\n");

        // display the contents of the products table
        console.table(productsArray);

        // get user input for the product to buy
        pickProductToBuy()

    })
    
};
// --------------------------------------------------------------------------------------
//  end of getAllProducts() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to prompt the user for the product to buy
// --------------------------------------------------------------------------------------
function pickProductToBuy()  {

    console.log("\n");

    inquirer.prompt(customerSelect).then(processOrder);

};
// --------------------------------------------------------------------------------------
// end of pickProductToBuy() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to process an order of the product the customer would like to purchase
// --------------------------------------------------------------------------------------
function processOrder(order) {

    productID = order.item_id;
    qtyToPurchase = order.qty;

    checkOrder(productID, qtyToPurchase);

};
// --------------------------------------------------------------------------------------
// end of processOrder() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to check the order of the product the customer would like to purchase
//  - if there is enough of the product left in stock, complete the order
//  - it the amount requested is more then what is in stock, don't allow the order and log a message
// --------------------------------------------------------------------------------------
function checkOrder(id, qty) {
    
    connection.query(
        "SELECT * FROM products WHERE ?", 
        [
            {
                item_id: id
            }
        ], 
        function(err, res) {
            
            if (err) throw err;

            if (res[0].stock_quantity >= qty) {
                
                // calculate the values that will be used to update the database in the completeOrder() function
                var newQty = res[0].stock_quantity - qty;
                var newSalesTotal = parseFloat(res[0].product_sales) + (parseInt(qty) * parseFloat(res[0].price)); 
                var product = res[0].product_name;

                completeOrder(id, newQty, res[0].price, newSalesTotal, product);

            } else {
               
                console.log("\nOrder can not be processed.  Insufficient Quantity In Stock!")

            }

            getAllProducts();

        }
    )
};
// --------------------------------------------------------------------------------------
// end of checkOrder() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to complete the order and display the details to the customer
// 
//  Parameter values:
//  id - the item_id of the product being purchased to be used to limit the update query
//  qty - the quantity left after the purchase to be used to set the updated stock_quantity
//  price - the price of the item being purchased 
//  sales - the product_sales total to be used to set the updated product_sales
//  product - the name of the product to be displayed back to the customer on successful update
// 
// --------------------------------------------------------------------------------------
function completeOrder(id, qty, price, sales, product) {
    
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: qty,
                product_sales: sales,
            },
            {
                item_id: id
            }
        ], 
        
        function(err, res) {
            if (err) throw err;

            console.log("\nYour Order has been placed!");
            console.log("\nYou have purchased " + qtyToPurchase + " " + product + " at a cost of $" + price.toFixed(2) + " each." );
            console.log("\nThe Total Cost for your order is:  $" + (qtyToPurchase * price).toFixed(2));

        }
    )   

};
// --------------------------------------------------------------------------------------
// end of completeOrder() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to end the app
// --------------------------------------------------------------------------------------
function endCustomer() {
    
    console.log("\n\nCome back again soon!");

    // Exit the app
    connection.end();
    process.exit();

};
// --------------------------------------------------------------------------------------
// end of endCustomer() function
// --------------------------------------------------------------------------------------