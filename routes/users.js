const express = require('express');
const router = express.Router();
const {client} = require('../db');
const jwt = require('jsonwebtoken');

router.get('/users', async (req, res) => {
    // res.send('hello world')
    try {
        console.log('hello world')
        const result = await client.query('SELECT * FROM users');
        console.log(result)
        res.json(result.rows);
    }
    catch (error){
    console.log (error)
    }
})


router.post('/auth/register', async (req, res) => {
    const { username, password } = req.body;
    try {
      const existingUser = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Username already taken' });
      }
  
      const result = await client.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
        [username, password]
      );
  
      const user = result.rows[0];
      const token = jwt.sign(user, SECRET);
      res.status(201).json({ token, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to register' });
    }
  });

router.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET);
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to log in' });
    }
  });


const { requireUser } = require('../middleware/auth');

router.get('/auth/me', requireUser, async (req, res) => {
    try {
      res.json({ user: req.user });
    } catch (err) {
      res.status(500).json({ error: 'Could not retrieve user info' });
    }
  });
  
module.exports = router;