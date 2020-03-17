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

// define variables for the inquirer questions to be asked
var mgrMenu = [
    {
    name: "option",
    message: "What would you like to do?",
    type: "list",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }
];

// --------------------------------------------------------------------------------------
// connect to the mysql server and sql database
// --------------------------------------------------------------------------------------
connection.connect(function(err) {
    if (err) throw err;

    // display all the manager menu upon successful connection to the database
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
        getAllProducts(1);
        break;
        
        case "View Low Inventory":
            console.log("\n");
            getLowInventory();
            break;
        
        case "Add to Inventory": 
            console.log("\n");
            getAllProducts();
            addInventory();
            break;
    
        case "Add New Product":
            console.log("\n");
            addProduct();
            break;
        
        default:
            endManager();
    };

};
// --------------------------------------------------------------------------------------
//  end of mgrOption() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to display all the products and the current inventory amounts
// 
//  Parameter values:
//  action  - 0 (default) - just display the list of products, another menu option will continue
//          - 1 - display the list of products and then return to the main menu
// 
// --------------------------------------------------------------------------------------
function getAllProducts(action = 0) {

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
                "Quantity in Stock": res[i].stock_quantity,
                "Product Sales": res[i].product_sales.toFixed(2)
            }
        
            productsArray.push(tableJSON);
        
        };

        console.log("\n");

        // display the contents of the resulting table
        console.table(productsArray);

        // added the action so that the display of all products could be used in the add inventory flow 
        // without going back to the menu until after the inventory was updated. 
        if (action === 1) {
            
            menu();
        
        };

    })
    
};
// --------------------------------------------------------------------------------------
//  end of getAllProducts() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to display items with a low inventory
// --------------------------------------------------------------------------------------
function getLowInventory() {

    connection.query("SELECT * FROM products WHERE stock_quantity < 5 ORDER BY stock_quantity", function(err, res) {
        
        if (err) throw err;
        
        if (res.length > 0) {

            let productsArray = [];
            
            let tableJSON;
            
            for (var i = 0; i < res.length; i++) {
            
                tableJSON = {
                    "ID": res[i].item_id,
                    "Product": res[i].product_name,
                    "Department": res[i].department_name,
                    "Price": res[i].price.toFixed(2),
                    "Quantity in Stock": res[i].stock_quantity,
                    "Product Sales": res[i].product_sales.toFixed(2)
                }
            
                productsArray.push(tableJSON);
            
            };

            // display the contents of the resulting table
            console.table(productsArray);
        
        } else {
            console.log("\nAll Products have sufficient inventory. Nothing to display. \n")
        }

        menu();

    })
    
};
// --------------------------------------------------------------------------------------
//  end of getLowInventory() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to allow the manager to select an item and add a specific amount to the inventory
// --------------------------------------------------------------------------------------
function addInventory() {

    // query the database for all products
    connection.query("SELECT * FROM products", function(err, res) {

        if (err) throw err;

        inquirer.prompt([
            {
            name: "product",
            type: "list",
            message: "What Item do you have inventory to add?",
            choices: function() {
                var prodArray = [];
                for (var i = 0; i < res.length; i++) {
                    prodArray.push(res[i].product_name);
                }
                return prodArray;
            }
            },
            {
            name: "add_qty",
            type: "input",
            message: "How much would you like to add to the current stock?",
            validate: function (value) {
                if (parseInt(value) > 0) {
                    return true;
                } else {
                    return false;
                }
            }
            }
        ])
        .then(function(answer) {
            // get the information of the chosen item
            var chosenItem;
            
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name === answer.product) {
                    chosenItem = res[i];
                }
            };

            // determine the new quantity so that it can be updated in the db
            var newQty = chosenItem.stock_quantity + parseInt(answer.add_qty);

            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newQty
                    },
                    {
                        item_id: chosenItem.item_id
                    }
                ],
                function(error) {
                    if (error) throw err;
                    
                    console.log("\nProduct Inventory has been updated");

                    menu();

                }
            );

        });

    });

};
// --------------------------------------------------------------------------------------
//  end of addInventory() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to allow the manager to add a new product to the db
// --------------------------------------------------------------------------------------
function addProduct() {

    // query the database for the department names available to be used to add the product 
    connection.query("SELECT department_name FROM departments ORDER BY department_name", function(err, results) {
    
        if (err) throw err;
    
        inquirer
            .prompt([
            {
                name: "product_name",
                message: "What is the name of the product you would like to add?"
            },
            {
                name: "department_name",
                type: "list",
                choices: function() {
                  var deptArray = [];
                  for (var i = 0; i < results.length; i++) {
                    deptArray.push(results[i].department_name);
                  }
                  return deptArray;
                },
                message: "What department does this product belong?"
            },
            {
                name: "price",
                message: "What is the Sales Price?",
                validate: function (value) {
                    if (parseFloat(value) > 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                name: "stock_quantity",
                message: "What is the initial Stock Quantity?",
                validate: function (value) {
                    if (parseInt(value) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            ])
            .then(function(answer) {

                connection.query(
                    "INSERT INTO products SET ?",
                    {
                        product_name: answer.product_name,
                        department_name: answer.department_name,
                        price: parseFloat(answer.price),
                        stock_quantity: parseInt(answer.stock_quantity)
                    },
                    function(err) {
                        if (err) throw err;
                        
                        console.log("\n" + answer.product_name + " was successfully added to the products available for sale!");
                                        
                        menu();

                    }
                );

            });

    });

};
// --------------------------------------------------------------------------------------
//  end of addProduct() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to end the app
// --------------------------------------------------------------------------------------
function endManager() {
    
    console.log("\n\nCome back again soon!");

    // Exit the app
    connection.end();
    process.exit();

};
// --------------------------------------------------------------------------------------
// end of endManager() function
// --------------------------------------------------------------------------------------