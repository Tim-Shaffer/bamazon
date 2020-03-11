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
var superMenu = [
    {
    name: "option",
    message: "What would you like to do?",
    type: "list",
    choices: ["View Product Sales by Department", "Create New Department", "Exit"]
    }
];


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

    connection.query("SELECT * FROM products", function(err, res) {
        
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

        // trigger the function to display the main Supervisor menu 
        menu();

    })
    
};
// --------------------------------------------------------------------------------------
//  end of getAllProducts() function
// --------------------------------------------------------------------------------------


// --------------------------------------------------------------------------------------
//  function to prompt the supervisor on what action to perform
// --------------------------------------------------------------------------------------
function menu()  {

    console.log("\n");

    inquirer.prompt(superMenu).then(superOption);

};
// --------------------------------------------------------------------------------------
//  end of menu() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to check what menu option was selected and call the associated processing
// --------------------------------------------------------------------------------------
function superOption(answers)  {

    switch(answers.option) {
        case "View Product Sales by Department":
        console.log("\n");
        viewProductSales();
        break;
    case "Create New Department":
        console.log("\n");
        addDepartment();
        break;
    default:
        endSupervisor();
    };

};
// --------------------------------------------------------------------------------------
//  end of mgrOption() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to display the department sales information
// --------------------------------------------------------------------------------------
function viewProductSales() {

    var query = "SELECT dept.department_id, dept.department_name, dept.overhead_costs,"
    query += " IFNULL(p.product_sales, 0.00) as product_sales, IFNULL(p.product_sales - dept.overhead_costs, 0 - dept.overhead_costs) AS total_profit"; 
    query += " FROM departments AS dept";
    query += " LEFT OUTER JOIN (SELECT department_name, SUM(product_sales) AS product_sales FROM products GROUP BY department_name) AS p";
    query += " ON dept.department_name = p.department_name ORDER BY total_profit DESC;"

    connection.query(query, function(err, res) {
        
        if (err) throw err;
        
        let deptArray = [];
        
        let tableJSON;
        
        for (var i = 0; i < res.length; i++) {
        
            tableJSON = {
                "Dept ID": res[i].department_id,
                "Department": res[i].department_name,
                "Overhead Costs": res[i].overhead_costs.toFixed(2),
                "Product Sales": res[i].product_sales.toFixed(2),
                "Total Profit": res[i].total_profit.toFixed(2)
            }
        
            deptArray.push(tableJSON);
        
        };

        console.log("\n");

        // display the contents of the resulting table
        console.table(deptArray);

        menu();

    })
    
};
// --------------------------------------------------------------------------------------
//  end of viewProductSales() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to end the app
// --------------------------------------------------------------------------------------
function endSupervisor() {
    
    console.log("\n\nCome back again soon!");

    // Exit the app
    connection.end();
    process.exit();

};
// --------------------------------------------------------------------------------------
// end of endSupervisor() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to allow the supervisor to add a new department to the db
// --------------------------------------------------------------------------------------
function addDepartment() {

    inquirer
        .prompt([
        {
            name: "department_name",
            message: "What is the name of the department you would like to add?"
        },
        {
            name: "overhead_costs",
            message: "What are the projected overhead costs?",
            validate: function (value) {
                if (parseFloat(value) > -1) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        ])
        .then(function(answer) {

            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: answer.department_name,
                    overhead_costs: parseFloat(answer.overhead_costs)
                },
                function(err) {
                    if (err) throw err;
                    
                    console.log("\nThe " + answer.department_name + " department was successfully added!");

                    // the demo showed displaying all products for sale again but it didn't make sense so just going back to the menu
                    // getAllProducts();
                    menu();

                }
            );

        });

};
// --------------------------------------------------------------------------------------
//  end of addDepartment() function
// --------------------------------------------------------------------------------------
