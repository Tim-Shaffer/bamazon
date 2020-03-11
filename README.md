# bamazon
Product Management Application

# Author 
> Tim Shaffer

## Tech Used
* JavaScript
* node.js
    * dotenv
    * inquirer
    * mysql
    * console.table
* MySQL
    * SQL 
        * CREATE DATABASE
        * USE DATABASE
        * CREATE TABLE
        * INSERT INTO
        * ALTER TABLE
        * SELECT DISTINCT
        * UPDATE 
        * ALIAS
        * IFNULL()
        * LEFT OUTER JOIN
        * ORDER BY
        * SUBQUERY
        * SUM
        * GROUP BY

## Command Line Interface (CLI) 
* Tasked with creating a CLI that interacts with a user and provides options or data based on a role

* Create an Amazon-like storefront that will Create, Read, and Update data within a MySQL database. 
    * The app will take in orders from Customers and deplete stock from the store's inventory.
    * The app will allow a Manager to view inventory and sales information for the products.  The Manager can also manage the inventory and replenish stock or add products.
    * The app will allow a Supervisor to track product sales across departments and provide a summary of the highest-grossing departments in the store.  The Supervisor can also add new departments to the company.

# Getting started

1.   Fork the the repository into your own space on GitHub
1.   Clone your forked repository into your own workspace.
1.   Within the terminal and the folder containing the repository, you must install the required node package dependencies defined in the **package.json** file into your folder.  Trigger the package install  

>
> npm i 
> 

1.   Create an environment `.env` file to contain information needed about your particular MySQL database server to be able to connect:

        DB_HOST=????
        DB_USER=????
        DB_PASS=????

1.   Update the specifics according to your system settings.
1.   Open MySQL Workbench and connect to the Server that you identified in the environment variables.
1.   In a new Query Window, copy and run the following commands that are also found in the `bamazon.sql` file.

        -- Create the Database if it doesn't already exist
    CREATE DATABASE IF NOT EXISTS bamazon;

    -- use the specified database
    USE bamazon;

    -- create a table in the bamazon database
    CREATE TABLE IF NOT EXISTS products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(100) NULL,
    price DECIMAL(10,2) DEFAULT 0.00,
    stock_quantity INT DEFAULT 0,
    PRIMARY KEY (item_id)
    );

1.   Insert some mock products with different departments, if you need help, copy and execute the below.

    -- Insert 10 mock products into the products table
    INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Craftsman 7-Piece Wrench Set", "Handtools", 21.99, 100),
    ("Irwin VISE-GRIP", "Handtools", 11.99, 100),
    ("Black Rubber Floor Mats", "Automotive", 16.09, 100),
    ("Car Wheel Chocks", "Automotive", 13.47, 100),
    ("Front Seat Covers", "Automotive", 14.99, 100),
    ("Hanging Bird Bath", "Outdoors", 59.99, 100),
    ("Atlas Sundial", "Outdoors", 169.99, 100),
    ("Cottage Bird House", "Outdoors", 74.99, 100),
    ("Ring Floodlight Camera", "Lighting", 189.99, 100),
    ("Army Gear Flashlight 2-Pack", "Lighting", 14.99, 100);

1.   This will give you the necessary data to start to view the process as a Customer.
1.   Trigger `node` and the corresponding **JavaScript** file for the requested role.

>
> node bamazonCustomer
>

## Customer Experience
    As a Customer of the bamazon store, the user will be able to place orders for any products available, as long as there is enough stock to cover the requested quantity.

*   The Customer will be provided with an initial view of all the products available to purchase including the price and quantity in stock

    ![Screenshot for initial Customer view](/screenshots/customer_startup.jpg)
