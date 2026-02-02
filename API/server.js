const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection - using WPF's database
const dbPath = path.join(__dirname, '..', 'Wpf', 'Database', 'product_app.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.run(`CREATE TABLE IF NOT EXISTS Products (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Price REAL NOT NULL,
    Stock INTEGER NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Error creating Products table:', err.message);
    } else {
      console.log('Products table ready');
      
      // Check if table is empty and add sample data
      db.get('SELECT COUNT(*) as count FROM Products', (err, row) => {
        if (row && row.count === 0) {
          insertSampleData();
        }
      });
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS Users (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT UNIQUE NOT NULL,
    Email TEXT UNIQUE NOT NULL,
    Password TEXT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating Users table:', err.message);
    } else {
      console.log('Users table ready');
    }
  });

  // Orders table to store purchase history
  db.run(`CREATE TABLE IF NOT EXISTS Orders (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL,
    TotalAmount REAL NOT NULL,
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status TEXT DEFAULT 'Completed',
    DeliveryStreet TEXT,
    DeliveryCity TEXT,
    DeliveryPostalCode TEXT,
    DeliveryPhone TEXT,
    DeliveryDate TEXT,
    DeliveryTimeSlot TEXT,
    PaymentMethod TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating Orders table:', err.message);
    } else {
      console.log('Orders table ready');
    }
  });

  // OrderItems table to store individual items in each order
  db.run(`CREATE TABLE IF NOT EXISTS OrderItems (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    OrderId INTEGER NOT NULL,
    ProductName TEXT NOT NULL,
    Price REAL NOT NULL,
    Quantity INTEGER NOT NULL,
    TotalPrice REAL NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(Id)
  )`, (err) => {
    if (err) {
      console.error('Error creating OrderItems table:', err.message);
    } else {
      console.log('OrderItems table ready');
    }
  });
}

// Insert sample products
function insertSampleData() {
  const sampleProducts = [
    { name: 'Fresh Apples', price: 1830, stock: 50 },
    { name: 'Banana', price: 180, stock: 100 },
    { name: 'Carrot', price: 820, stock: 75 },
    { name: 'Tomatoes', price: 430, stock: 60 },
    { name: 'Chicken Breast', price: 1300, stock: 30 },
    { name: 'Tuna Fish', price: 3490, stock: 20 }
  ];

  const stmt = db.prepare('INSERT INTO Products (Name, Price, Stock) VALUES (?, ?, ?)');
  sampleProducts.forEach(product => {
    stmt.run(product.name, product.price, product.stock);
  });
  stmt.finalize();
  console.log('Sample products inserted');
}

// ==================== PRODUCT API ENDPOINTS ====================

// GET all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM Products', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// GET single product by ID
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM Products WHERE Id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json({
        message: 'success',
        data: row
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  });
});

// POST create new product
app.post('/api/products', (req, res) => {
  const { name, price, stock } = req.body;
  
  if (!name || price === undefined || stock === undefined) {
    res.status(400).json({ error: 'Name, price, and stock are required' });
    return;
  }

  const sql = 'INSERT INTO Products (Name, Price, Stock) VALUES (?, ?, ?)';
  db.run(sql, [name, price, stock], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({
      message: 'Product created successfully',
      data: { id: this.lastID, name, price, stock }
    });
  });
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const { name, price, stock } = req.body;

  if (!name || price === undefined || stock === undefined) {
    res.status(400).json({ error: 'Name, price, and stock are required' });
    return;
  }

  const sql = 'UPDATE Products SET Name = ?, Price = ?, Stock = ? WHERE Id = ?';
  db.run(sql, [name, price, stock, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json({
        message: 'Product updated successfully',
        data: { id, name, price, stock }
      });
    }
  });
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM Products WHERE Id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json({
        message: 'Product deleted successfully',
        changes: this.changes
      });
    }
  });
});

// ==================== USER API ENDPOINTS ====================

// POST register new user
app.post('/api/users/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    res.status(400).json({ error: 'Username, email, and password are required' });
    return;
  }

  const sql = 'INSERT INTO Users (Username, Email, Password) VALUES (?, ?, ?)';
  db.run(sql, [username, email, password], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Username or email already exists' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    res.status(201).json({
      message: 'User registered successfully',
      data: { id: this.lastID, username, email }
    });
  });
});

// POST login user
app.post('/api/users/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  db.get('SELECT Id, Username, Email FROM Users WHERE Username = ? AND Password = ?', 
    [username, password], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json({
        message: 'Login successful',
        data: row
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});

// GET all users (for admin)
app.get('/api/users', (req, res) => {
  db.all('SELECT Id, Username, Email, CreatedAt FROM Users', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// ==================== ORDER API ENDPOINTS ====================

// POST create new order (checkout)
app.post('/api/orders', (req, res) => {
  const { username, items, totalAmount, deliveryAddress, deliverySchedule, paymentMethod } = req.body;
  
  if (!username || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Username and items are required' });
    return;
  }

  // Insert order with delivery details
  const orderSql = `INSERT INTO Orders 
    (Username, TotalAmount, DeliveryStreet, DeliveryCity, DeliveryPostalCode, 
     DeliveryPhone, DeliveryDate, DeliveryTimeSlot, PaymentMethod) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  const orderParams = [
    username, 
    totalAmount,
    deliveryAddress?.street || null,
    deliveryAddress?.city || null,
    deliveryAddress?.postalCode || null,
    deliveryAddress?.phone || null,
    deliverySchedule?.date || null,
    deliverySchedule?.timeSlot || null,
    paymentMethod || null
  ];
  
  db.run(orderSql, orderParams, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const orderId = this.lastID;

    // Insert order items
    const itemSql = 'INSERT INTO OrderItems (OrderId, ProductName, Price, Quantity, TotalPrice) VALUES (?, ?, ?, ?, ?)';
    const stmt = db.prepare(itemSql);

    items.forEach(item => {
      stmt.run(orderId, item.productName, item.price, item.quantity, item.totalPrice);
    });

    stmt.finalize((err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.status(201).json({
        message: 'Order created successfully',
        data: { orderId, username, totalAmount, itemCount: items.length }
      });
    });
  });
});

// GET orders by username
app.get('/api/orders/:username', (req, res) => {
  const username = req.params.username;

  db.all('SELECT * FROM Orders WHERE Username = ? ORDER BY OrderDate DESC', [username], (err, orders) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Get items for each order
    const ordersWithItems = [];
    let processed = 0;

    if (orders.length === 0) {
      res.json({ message: 'success', data: [] });
      return;
    }

    orders.forEach(order => {
      db.all('SELECT * FROM OrderItems WHERE OrderId = ?', [order.Id], (err, items) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        ordersWithItems.push({
          ...order,
          items: items
        });

        processed++;
        if (processed === orders.length) {
          res.json({
            message: 'success',
            data: ordersWithItems
          });
        }
      });
    });
  });
});

// GET all orders (for admin)
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM Orders ORDER BY OrderDate DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Grocery Shop API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      users: '/api/users',
      register: '/api/users/register',
      login: '/api/users/login',
      orders: '/api/orders',
      createOrder: 'POST /api/orders',
      userOrders: '/api/orders/:username'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Smart Grocery Shop API running on http://localhost:${PORT}`);
  console.log(`📦 Products endpoint: http://localhost:${PORT}/api/products`);
  console.log(`👥 Users endpoint: http://localhost:${PORT}/api/users\n`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('\n📪 Database connection closed');
    process.exit(0);
  });
});
