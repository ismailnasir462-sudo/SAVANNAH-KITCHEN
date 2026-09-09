CREATE DATABASE IF NOT EXISTS savannah_kitchen;
USE savannah_kitchen;

-- 1. Customer Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  subject VARCHAR(200) DEFAULT 'General Inquiry',
  text TEXT NOT NULL,
  reply TEXT DEFAULT NULL,
  status ENUM('Unread', 'Replied') DEFAULT 'Unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  guests VARCHAR(50) NOT NULL,
  res_date DATE NOT NULL,
  res_time TIME NOT NULL,
  seating VARCHAR(50) DEFAULT 'Indoor',
  special_request TEXT DEFAULT NULL,
  status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Food Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50) DEFAULT NULL,
  items TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('Pending', 'Preparing', 'Out for Delivery', 'Completed') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);