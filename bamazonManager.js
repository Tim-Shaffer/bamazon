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
var mgrMenu = [{
    name: "option",
    message: "Select an Option from the Menu",
    type: "list",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }
    ];

// --------------------------------------------------------------------------------------
// connect to the mysql server and sql database
// --------------------------------------------------------------------------------------
connection.connect(function(err) {
    if (err) throw err;

    // display the main menu for manager processing
    menu();

});

// --------------------------------------------------------------------------------------
//  function to prompt the manager on what action to perform
// --------------------------------------------------------------------------------------
function menu()  {

    console.log("\n");

    inquirer.prompt(mgrMenu).then(mgrOption);

};
// --------------------------------------------------------------------------------------
//  end of menu() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to check what menu option was selected and call the associated processing
// --------------------------------------------------------------------------------------
function mgrOption(answers)  {

    switch(answers.option) {
        case "View Products for Sale":
        console.log("\n");
        getAllProducts();
        break;
    case "View Low Inventory":
        console.log("\n");
        // getLowInventory();
        connection.end();
        break;
    case "Add to Inventory": 
        console.log("\n");
        // addInventory();
        connection.end();
        break;
    case "Add New Product":
        console.log("\n");
        // addProduct();
        connection.end();
        break;
    default:
        connection.end();
    };

};
// --------------------------------------------------------------------------------------
//  end of mgrOption() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to display all the products and the current inventory amounts
// --------------------------------------------------------------------------------------
function getAllProducts() {

    connection.query("SELECT * FROM products", function(err, res) {
        
        if (err) throw err;
        
        let productsArray = [];
        
        let tableJSON;
        
        for (var i = 0; i < res.length; i++) {
        
            tableJSON = {
                "ID": res[i].item_id,
                "Product Name": res[i].product_name,
                "Price": res[i].price.toFixed(2),
                "In Stock": res[i].stock_quantity,
            }
        
            productsArray.push(tableJSON);
        
        };

        // display the contents of the products table
        console.table(productsArray);

        menu();

    })
    
};
// --------------------------------------------------------------------------------------
//  end of getAllProducts() function
// --------------------------------------------------------------------------------------