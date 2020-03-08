-- Create the Database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS bamazon;

-- use the specified database
USE bamazon;

-- create a table in the bamazon database
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
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

