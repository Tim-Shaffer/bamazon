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
    message: "Select an Option from the Menu",
    type: "list",
    choices: ["View Product Sales by Department", "Create New Department", "Exit"]
    }
];


// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;

    // display the main menu for supervisor processing
    menu();

});

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

// 
function viewProductSales() {

    var query = "SELECT dept.department_id, dept.department_name, dept.overhead_costs, p.product_sales, p.product_sales - dept.overhead_costs AS total_profit"; 
    query += " FROM departments AS dept";
    query += " INNER JOIN (SELECT department_name, SUM(product_sales) AS product_sales FROM products GROUP BY department_name) AS p";
    query += " WHERE dept.department_name = p.department_name ORDER BY dept.department_id ASC;"

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

function addDepartment() {

    console.log("Add a New Department");
    menu();

};

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

