# bamazon
Product Management Application

# Author 
> Tim Shaffer

## Contents
* [Tech Used](https://github.com/Tim-Shaffer/bamazon#tech-used)
* [CLI](https://github.com/Tim-Shaffer/bamazon#command-line-interface-cli)
* [Getting Started](https://github.com/Tim-Shaffer/bamazon#getting-started)
* [Customer Experience](https://github.com/Tim-Shaffer/bamazon#customer-experience)
* [Manager Experience](https://github.com/Tim-Shaffer/bamazon#manager-experience)
* [Supervisor Experience](https://github.com/Tim-Shaffer/bamazon#supervisor-experience)

# Tech Used
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

# Command Line Interface (CLI) 
* Tasked with creating a CLI that interacts with a user and provides options or data based on a role

* Create an Amazon-like storefront that will Create, Read, and Update data within a MySQL database. 
    * The app will take in orders from Customers and deplete stock from the store's inventory.
    * The app will allow a Manager to view inventory and sales information for the products.  The Manager can also manage the inventory and replenish stock or add products.
    * The app will allow a Supervisor to track product sales across departments and provide a summary of the highest-grossing departments in the store.  The Supervisor can also add new departments to the company.

# Getting started

1. Fork the the repository into your own space on GitHub
1. Clone your forked repository into your own workspace.
1. Within the terminal and the folder containing the repository, you must install the required node package dependencies defined in the **package.json** file into your folder.  Trigger the package install  

>
> npm i 
> 

4. Create an environment `.env` file to contain information needed about your particular MySQL database server to be able to connect:

        DB_HOST=????
        DB_USER=????
        DB_PASS=????

5. Update the specifics according to your system settings and save.
1. Open MySQL Workbench and connect to the Server that you identified in the environment variables.
1. In a new Query Window, copy and run the following commands that are also found in the `bamazon.sql` file.

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

8. Insert some mock products with different departments, if you need help, copy and execute the below.

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

9. This will give you the necessary data to start to view the process as a Customer.
1. Trigger `node` and the corresponding **JavaScript** file for the requested role.

>
> node bamazonCustomer
>

# Customer Experience
As a Customer of the bamazon store, the user will be able to place orders for any products available, as long as there is enough stock to cover the requested quantity.

*   The Customer will be provided with an initial view of all the products available to purchase including the price and quantity in stock

    ![Screenshot for initial Customer view](/screenshots/customer_startup.jpg)

*   The Customer will be able to select an item to purchase by item id and then the quantity they would like to purchase.

    ![Screenshot for Customer selecting an item to purchase](/screenshots/customer_select.jpg)

*   If the order can be processed, the customer is provided with the details of the order and may then pick another item.  The stock_quantity is updated with the new total amount after the sale.

    ![Screenshot for Customer order being successfully completed](/screenshots/customer_completed.jpg)

*   If the customer selects an item and tries to purchase more than what is currently in stock.....

    ![Screenshot for Customer trying to buy too much](/screenshots/customer_select_too_many.jpg)

*   A message that the order cannot be processed due to insufficient quantity will be logged and the customer can pick another item.

    ![Screenshot for Customer Order being declined](/screenshots/customer_order_failed.jpg)

*   When the customer does not want to make any more purchases, they select 'q' and the session is ended.

    ![Screenshot for Customer Quit](/screenshots/customer_quit.jpg)

# Manager Experience
As a Manager of the bamazon store, the user will be able to view sales information for all the products available.  The Manager can also perform maintenance tasks such as monitoring products with a low inventory, adding items to inventory, and adding new products to be listed for sale.

*   The Manager will be provided with menu of options upon successful connection to the database.

    ![Screenshot for initial Manager view](/screenshots/manager_startup.jpg)

# Supervisor Experience
As a Supervisor of the bamazon store, the user will be able to view sales information for all the products available in the store.  The Supervisor can monitor sales and expense information summarized by departments.  The supervisor will also be able to add new departments as needed. 

*   The Supervisor will be provided with an initial view of all the products available in the store including the Product Sales data before a menu of options is presented.

    ![Screenshot for initial Supervisor view](/screenshots/supervisor_startup.jpg)

*   Selecting to "View Product Sales by Department", the store Supervisor is presented with a report for all the departments to include the overhead costs, product sales, and total profits.  The report is displayed with the most profitable department at the top down through the least profitable at the bottom.

    ![Screenshot for Supervisor Sales by Department](/screenshots/supervisor_sales.jpg)

*   The Supervisor can also select to Create a New Department at which point the prompts will walk them through the entries to populate a new department including the name of the department and the projected overhead costs.

    ![Screenshot for Supervisor Adding a new Department](/screenshots/supervisor_new_department.jpg)

*   After the department is added, re-selecting the "View Product Sales by Department" will be updated with the new department being placed in it's order depending upon the overhead costs entered.

    ![Screenshot for Supervisor Sales after Department Add](/screenshots/supervisor_sales_after_add.jpg)

*   When the Supervisor is completed, they select 'exit' and the session is ended.

    ![Screenshot for Supervisor Exit](/screenshots/supervisor_exit.jpg)
