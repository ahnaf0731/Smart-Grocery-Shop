const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, '..', 'Wpf', 'Database', 'product_app.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to database:', dbPath);
    addNewColumns();
  }
});

function addNewColumns() {
  console.log('\nAdding new columns to Orders table...');
  
  const newColumns = [
    'ALTER TABLE Orders ADD COLUMN DeliveryStreet TEXT',
    'ALTER TABLE Orders ADD COLUMN DeliveryCity TEXT',
    'ALTER TABLE Orders ADD COLUMN DeliveryPostalCode TEXT',
    'ALTER TABLE Orders ADD COLUMN DeliveryPhone TEXT',
    'ALTER TABLE Orders ADD COLUMN DeliveryDate TEXT',
    'ALTER TABLE Orders ADD COLUMN DeliveryTimeSlot TEXT',
    'ALTER TABLE Orders ADD COLUMN PaymentMethod TEXT'
  ];

  let completed = 0;
  let errors = 0;

  newColumns.forEach((sql, index) => {
    db.run(sql, (err) => {
      completed++;
      
      if (err) {
        if (err.message.includes('duplicate column name')) {
          console.log(`✓ Column ${index + 1} already exists`);
        } else {
          console.error(`✗ Error adding column ${index + 1}:`, err.message);
          errors++;
        }
      } else {
        console.log(`✓ Successfully added column ${index + 1}`);
      }

      // Check if all operations are done
      if (completed === newColumns.length) {
        console.log('\n===========================================');
        if (errors === 0) {
          console.log('✓ Database migration completed successfully!');
        } else {
          console.log(`⚠ Migration completed with ${errors} error(s)`);
        }
        console.log('===========================================\n');
        db.close();
      }
    });
  });
}
