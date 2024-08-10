const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: '111.229.194.46',
  user: 'mapdata',
  password: '2022wenjieTHU',
  database: 'mapdata'
});
console.log('Connected to the database');
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + db.threadId);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const sql = 'INSERT INTO user (username, password) VALUES (?, ?)';
    
    db.query(sql, [username, password], (err, result) => {
      if (err) {
        console.error('Error registering new user:', err);
        res.status(500).send('Error registering new user');
      } else {
        res.status(201).send('User registered');
      }
    });
  });

  



app.post('/login', (req, res) => {
const { username, password } = req.body;
const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';

db.query(sql, [username, password], (err, result) => {
    if (err) {
    res.status(500).send('Error logging in');
    } else {
    if (result.length > 0) {
        res.status(200).send('Logged in successfully');
    } else {
        res.status(401).send('Username or password is incorrect');
    }
    }
});
});
  