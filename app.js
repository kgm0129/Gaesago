const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kk00998877.',
  database: 'store_inventory'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  }
  console.log('MySQL Connected...');
});


app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/items', (req, res) => {
  const category = req.query.category;
  let sql = 'SELECT * FROM items';
  if (category) {
    sql += ' WHERE category = ?';
  }
  db.query(sql, [category], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post('/api/items', (req, res) => {
  const newItem = {
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
    category: req.body.category 
  };
  const sql = 'INSERT INTO items SET ?';
  db.query(sql, newItem, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send('Item added...');
  });
});


app.delete('/api/items/:id', (req, res) => {
  const itemId = req.params.id;
  const sql = 'DELETE FROM items WHERE id = ?';
  db.query(sql, [itemId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send('Item deleted...');
  });
});


app.put('/api/items/:id', (req, res) => {
  const itemId = req.params.id;
  const updatedItem = {
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
    category: req.body.category
  };
  const sql = 'UPDATE items SET ? WHERE id = ?';
  db.query(sql, [updatedItem, itemId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send('Item updated...');
  });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
