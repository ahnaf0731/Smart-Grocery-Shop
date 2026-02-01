const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'Wpf', 'Database', 'product_app.db');
const db = new sqlite3.Database(dbPath);

console.log('Checking database:', dbPath);
console.log('\n=== Tables ===');

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  tables.forEach(table => {
    console.log(`  - ${table.name}`);
  });

  // Check Users table
  console.log('\n=== Users Table ===');
  db.all("SELECT * FROM Users", (err, users) => {
    if (err) {
      console.error('Error reading Users table:', err.message);
    } else {
      console.log(`Total users: ${users.length}`);
      if (users.length > 0) {
        users.forEach(user => {
          console.log(`  - ${user.Username} (${user.Email})`);
        });
      } else {
        console.log('  No users found in database');
      }
    }

    // Check Products table
    console.log('\n=== Products Table ===');
    db.all("SELECT * FROM Products LIMIT 5", (err, products) => {
      if (err) {
        console.error('Error reading Products table:', err.message);
      } else {
        console.log(`Showing first 5 products (total may be more):`);
        products.forEach(product => {
          console.log(`  - ${product.Name}: Rs ${product.Price} (Stock: ${product.Stock})`);
        });
      }
      db.close();
    });
  });
});
