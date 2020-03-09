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

// define variables for the inquirer questions to be asked
var customerSelect = [{
    name: "item_id",
    message: "Enter the ID of the item you would like to buy:",
    },
    {
    name: "qty",
    message: "How many would you like to purchase?",
    }
    ];

// global variables for Product information
var productID;
var qtyToPurchase;
var costPerUnit;

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;

    getAllProducts();
    
    // connection.end();

});


// 
function getAllProducts() {

    connection.query("SELECT * FROM products", function(err, res) {
        
        if (err) throw err;
        
        let productsArray = [];
        
        let tableJSON;
        
        for (var i = 0; i < res.length; i++) {
        
            tableJSON = {
                "item_id": res[i].item_id,
                "product_name": res[i].product_name,
                "price": res[i].price
            }
        
            productsArray.push(tableJSON);
        
        };

        // display the contents of the products table
        console.table(productsArray);

        // get user input for the product to buy
        pickProductToBuy()

    })
    
};

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
//  function to process order of the product the customer would like to purchase
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
//  function to process order of the product the customer would like to purchase
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

            if (res[0].stock_quantity > qty) {
                var newQty = res[0].stock_quantity - qty;
                console.log(qty + " of item # " +  id + " was selected for purchase at a cost of " + res[0].price + " each." );
                completeOrder(id, newQty, res[0].price);
            } else {
                console.log("Order can not be processed.  Insufficient Quantity In Stock!")
                connection.end();
            }

        }
    )
};
// --------------------------------------------------------------------------------------
// end of checkOrder() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to complete the order and display the details to the customer
// --------------------------------------------------------------------------------------
function completeOrder(id, qty, price) {
    
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: qty,
            },
            {
                item_id: id
            }
        ], 
        
        function(err, res) {
            if (err) throw err;

            console.log("Your Order has been placed!\n");
            console.log("The Total Cost for your order is:  $" + (qtyToPurchase * price).toFixed(2));

            connection.end();

        }
    )   

};
// --------------------------------------------------------------------------------------
// end of completeOrder() function
// --------------------------------------------------------------------------------------