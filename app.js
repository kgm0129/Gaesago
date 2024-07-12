const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2'); 
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


app.get('/api/items', (req, res) => {
  let sql = 'SELECT * FROM items';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post('/api/items', (req, res) => {
  let newItem = { name: req.body.name, price: req.body.price, stock: req.body.stock };
  let sql = 'INSERT INTO items SET ?';
  db.query(sql, newItem, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send('Item added...');
  });
});

app.put('/api/items/:id', (req, res) => {
  let sql = `UPDATE items SET name='${req.body.name}', price=${req.body.price}, stock=${req.body.stock} WHERE id=${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send('Item updated...');
  });
});

app.delete('/api/items/:id', (req, res) => {
  let sql = `DELETE FROM items WHERE id=${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send('Item deleted...');
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
