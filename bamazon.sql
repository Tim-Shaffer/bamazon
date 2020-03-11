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

-- Supervisor View Challenge Items
-- create a table in the bamazon database
CREATE TABLE IF NOT EXISTS departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NULL,
  overhead_costs DECIMAL(10,2) DEFAULT 0.00,
  PRIMARY KEY (department_id)
);

-- add a new column to the existing products table
ALTER TABLE products ADD product_sales DECIMAL(10,2) DEFAULT 0.00;

-- Populate the departments table from the names entered into the products table
INSERT INTO departments (department_name)
SELECT DISTINCT department_name FROM products ORDER BY department_name ASC;

-- Select Query for the supervisor total_profit by department
SELECT dept.department_id, dept.department_name, dept.overhead_costs, p.product_sales, p.product_sales - dept.overhead_costs AS total_profit  
  FROM departments AS dept 
  INNER JOIN (SELECT department_name, SUM(product_sales) AS product_sales FROM products GROUP BY department_name) AS p 
  WHERE dept.department_name = p.department_name ORDER BY dept.department_id ASC;
