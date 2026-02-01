# Smart Grocery Shop REST API

## Installation

1. Install Node.js from https://nodejs.org/
2. Navigate to the API folder
3. Run: `npm install`

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

## Testing with Postman or Browser

- GET requests can be tested directly in browser
- POST/PUT/DELETE require tools like Postman or Insomnia

## Database

The API uses the same SQLite database as the WPF application:
`../Wpf/Database/product_app.db`
