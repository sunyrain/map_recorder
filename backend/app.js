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
    // Ensure the SQL query selects only the necessary columns, preferably just 'id'
    const sql = 'SELECT user_id FROM user WHERE username = ? AND password = ?';

    db.query(sql, [username, password], (err, result) => {
        if (err) {
            res.status(500).send('Error logging in');
        } else {
            if (result.length > 0) {
                // Since SELECT id is used, result[0].id will give us the user's id
                const user_id = result[0].user_id;
                res.status(200).send({ message: 'Logged in successfully', user_id: user_id });
            } else {
                res.status(401).send('Username or password is incorrect');
            }
        }
    });
});


// 保存用户的地图访问记录
app.post('/save-visit', (req, res) => {
    const { user_id, county_id, visited } = req.body;
    console.log('Saving visit data:', user_id, county_id, visited);
    const sql = `
        INSERT INTO visits (user_id, county_id, visited)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE visited = VALUES(visited);
    `;

    db.query(sql, [user_id, county_id, visited], (err, result) => {
        if (err) {
            console.error('Error saving visit data:', err);
            res.status(500).send('Error saving visit data');
        } else {
            console.log('Visit data saved or updated successfully:', result);
            res.status(200).send('Visit data saved or updated successfully');
        }
    });
});

  
  // 加载用户的地图访问记录
  app.get('/load-visits/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    const sql = 'SELECT county_name, visited FROM visits WHERE user_id = ?';
  
    db.query(sql, [user_id], (err, results) => {
      if (err) {
        res.status(500).send('Error loading visits');
      } else {
        res.json(results);
      }
    });
  });
  