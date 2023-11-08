// server/index.js
const express = require("express");
const bodyParser = require('body-parser');
const mysql = require('mysql');


const connection = mysql.createConnection({
  host: 'reto.c9znmfy7uvpg.us-east-2.rds.amazonaws.com',
  user: 'root',
  password: '',
  database: 'kueski3',
  port: '3306'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

const app = express();
app.use(bodyParser.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from server side!"});
});


// Endpoint inicial
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal server error');
      return;
    }
    if (results.length > 0) {
      res.send(results);
    } else {
      res.status(404).send(`No users found`);
    }
  });
});

// Endpoint para obtener la información de un usuario por su ID

app.get('/users/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  connection.query('SELECT * FROM users WHERE user_id = ?', [user_id], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal server error');
      return;
    }
    if (results.length > 0) {
      res.send(results[0]); // Devuelve solo el primer resultado
    } else {
      res.status(404).send(`User with user_id ${user_id} not found`);
    }
  });
});

app.get('/requests/:request_id', (req, res) => {
  const request_id = req.params.request_id;
  connection.query('SELECT * FROM requests WHERE request_id = ?', [request_id], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal server error');
      return;
    }
    if (results.length > 0) {
      res.send(results[0]); // Devuelve solo el primer resultado
    } else {
      res.status(404).send(`Request with request_id ${request_id} not found`);
    }
  });
});


app.get('/requests', (req, res) => {
  connection.query('SELECT * FROM requests', (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal server error');
      return;
    }
    if (results.length > 0) {
      res.send(results);
    } else {
      res.status(404).send(`No users found`);
    }
  });
});



app.get('/user-requests', (req, res) => {
  connection.query('SELECT u.user_id, u.email, u.name, u.first_last_name, u.nationality, u.curp, u.phone_number, r.arco_right, r.comment FROM users u INNER JOIN requests r ON u.user_id = r.user_id', (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal server error');
      return;
    }
    if (results.length > 0) {
      res.send(results);
    } else {
      res.status(404).send(`No data found`);
    }
  });
});

app.put('/users/:user_id/:request_id', (req, res) => {
  const user_id = req.params.user_id;
  const requestId = req.params.request_id;
  const updatedUser = req.body;
  connection.query('UPDATE USERS SET ? WHERE user_id = ?', [updatedUser, user_id], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal server error');
      return;
    }
    if (results.affectedRows > 0) {

  connection.query('DELETE FROM REQUESTS WHERE request_id = ?', requestId, (error, results) => {
    if (error) throw error;

    res.status(200).json({ message: `El requests con ID ${requestId} ha sido eliminado` });
  });
    } else {
      res.status(404).send(`User with user_id ${user_id} not found`);
    }
  });
});


app.delete('/delete/:userId', (req, res) => {
  const userId = req.params.userId;

  connection.query('DELETE FROM USERS WHERE user_id = ?', userId, (error, results) => {
    if (error) throw error;

    res.status(200).json({ message: `El usuario con ID ${userId} ha sido eliminado` });
  });
});

app.delete('/reqDelete/:requestId', (req, res) => {
  const requestId = req.params.requestId;

  connection.query('DELETE FROM REQUESTS WHERE request_id = ?', requestId, (error, results) => {
    if (error) throw error;

    res.status(200).json({ message: `El requests con ID ${requestId} ha sido eliminado` });
  });
});


app.get('/api/login', (req, res) => {
  res.send('You have successfully logged in.');
});

app.get('/requests/:id', (req, res) => {
  const userId = req.params.id;

  connection.query('SELECT comment FROM requests WHERE user_id = ?', [userId], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal server error');
      return;
    }
    if (results.length > 0) {
      const comment = results[0].comment;
      res.send({ comment });
    } else {
      res.status(404).send('No comment found');
    }
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
