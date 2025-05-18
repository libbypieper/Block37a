const express = require('express');
const router = express.Router();
const db = require('../db');

// router.get('/items', async (req, res) => {
//     const result = await db.query('SELECT * FROM items');
//     res.json(result.rows);
// })

router.get('/items', async (req, res) => {
    try {
        const result = await client.query(`
          SELECT items.*, 
            COALESCE(AVG(reviews.rating), 0) AS average_rating
          FROM items
          LEFT JOIN reviews ON items.id = reviews.item_id
          GROUP BY items.id
          ORDER BY items.name
        `);
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get items' });
      }
    });

router.get('/items/:itemId', async (req, res) => {
        const { itemId } = req.params;
        try {
          const result = await client.query(`
            SELECT items.*, 
              COALESCE(AVG(reviews.rating), 0) AS average_rating
            FROM items
            LEFT JOIN reviews ON items.id = reviews.item_id
            WHERE items.id = $1
            GROUP BY items.id
          `, [itemId]);
      
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
          }
      
          res.json(result.rows[0]);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to get item' });
        }
    });
      

router.get('/items/:itemId/reviews', async (req, res) => {
        const { itemId } = req.params;
        try {
          const result = await client.query(`
            SELECT reviews.*, users.username
            FROM reviews
            JOIN users ON reviews.user_id = users.id
            WHERE reviews.item_id = $1
            ORDER BY reviews.created_at DESC
          `, [itemId]);
      
          res.json(result.rows);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to get reviews for item' });
        }
      });

module.exports = router;