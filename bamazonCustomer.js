// code to read and set any environment variables with the .env package 
require("dotenv").config();

//variable for the mysql package
var mysql = require("mysql");

//variable for the inquirer package
var inquirer = require("inquirer");

//variable for the console.table package
const cTable = require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user:  process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "bamazon"
});

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

    })
    
};