// code to read and set any environment variables with the .env package 
require("dotenv").config();

var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: process.env.DB_HOST,

  // Your port; if not 3306
  port: 3306,

  // Your username
  user:  process.env.DB_USER,

  // Your password
  password: process.env.DB_PASS,
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the bamazon Database.");
  connection.end();
});
