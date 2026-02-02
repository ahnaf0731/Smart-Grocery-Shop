# Smart Grocery Shop REST API

## Overview

RESTful API for Smart Grocery Shop - handles user authentication, product management, and order processing with delivery details.

## Installation

1. Install Node.js from https://nodejs.org/
2. Navigate to the API folder
3. Run: `npm install`

## Database Setup

### First Time Setup

The API will automatically create tables on first run. However, if you need to add new columns (for delivery details), run:

```bash
node migrate_database.js
```

This will add the following columns to the Orders table:
- DeliveryStreet
- DeliveryCity
- DeliveryPostalCode
- DeliveryPhone
- DeliveryDate
- DeliveryTimeSlot
- PaymentMethod

## Running the API

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The API will run on http://localhost:3000

## API Endpoints

### Products

- **GET** `/api/products` - Get all products
- **GET** `/api/products/:id` - Get single product
- **POST** `/api/products` - Create new product
  ```json
  {
    "name": "Product Name",
    "price": 100.50,
    "stock": 50
  }
  ```
- **PUT** `/api/products/:id` - Update product
- **DELETE** `/api/products/:id` - Delete product

### Users

- **POST** `/api/users/register` - Register new user
  ```json
  {
    "username": "john",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **POST** `/api/users/login` - Login user
  ```json
  {
    "username": "john",
    "password": "password123"
  }
  ```
- **GET** `/api/users` - Get all users (admin)

### Orders

- **POST** `/api/orders` - Create new order with delivery details
  ```json
  {
    "username": "john",
    "items": [
      {
        "productName": "Fresh Apples",
        "price": 1830,
        "quantity": 2,
        "totalPrice": 3660
      }
    ],
    "totalAmount": 3660,
    "deliveryAddress": {
      "street": "123 Main Street",
      "city": "Colombo",
      "postalCode": "10000",
      "phone": "+94 77 123 4567"
    },
    "deliverySchedule": {
      "date": "2026-02-10",
      "timeSlot": "morning"
    },
    "paymentMethod": "cash"
  }
  ```
- **GET** `/api/orders/:username` - Get user's order history with delivery details

## Database

The API uses the same SQLite database as the WPF application:
`../Wpf/Database/product_app.db`

### Database Schema

#### Products Table
- Id (INTEGER PRIMARY KEY)
- Name (TEXT)
- Price (REAL)
- Stock (INTEGER)

#### Users Table
- Id (INTEGER PRIMARY KEY)
- Username (TEXT UNIQUE)
- Email (TEXT UNIQUE)
- Password (TEXT)
- CreatedAt (DATETIME)

#### Orders Table
- Id (INTEGER PRIMARY KEY)
- Username (TEXT)
- TotalAmount (REAL)
- OrderDate (DATETIME)
- Status (TEXT)
- DeliveryStreet (TEXT)
- DeliveryCity (TEXT)
- DeliveryPostalCode (TEXT)
- DeliveryPhone (TEXT)
- DeliveryDate (TEXT)
- DeliveryTimeSlot (TEXT - morning/afternoon/evening)
- PaymentMethod (TEXT - cash/card/online)

#### OrderItems Table
- Id (INTEGER PRIMARY KEY)
- OrderId (INTEGER FOREIGN KEY)
- ProductName (TEXT)
- Price (REAL)
- Quantity (INTEGER)
- TotalPrice (REAL)

## Testing with Postman or Browser

- GET requests can be tested directly in browser
- POST/PUT/DELETE require tools like Postman or Insomnia

## Features

- User authentication (register/login)
- Product CRUD operations
- Order processing with delivery details
- Delivery address tracking
- Delivery time slot selection
- Payment method recording
- Order history with full details
