const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/items/:itemId/reviews/:reviewId', async (req, res) => {
    const { itemId, reviewId } = req.params;
  
    try {
      const result = await client.query(`
        SELECT * FROM reviews
        WHERE id = $1 AND item_id = $2
      `, [reviewId, itemId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Review not found' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch review' });
    }
  });


router.post('/items/:itemId/reviews', requireUser, async (req, res) => {
    const { itemId } = req.params;
    const { rating, text } = req.body;
    const userId = req.user.id;
  
    try {
      // Check if user already reviewed this item
      const existing = await client.query(`
        SELECT * FROM reviews
        WHERE user_id = $1 AND item_id = $2
      `, [userId, itemId]);
  
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'You have already reviewed this item' });
      }
  
      const result = await client.query(`
        INSERT INTO reviews (user_id, item_id, rating, text)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [userId, itemId, rating, text]);
  
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create review' });
    }
  });

router.get('/reviews/me', requireUser, async (req, res) => {
    const userId = req.user.id;
  
    try {
      const result = await client.query(`
        SELECT * FROM reviews
        WHERE user_id = $1
        ORDER BY created_at DESC
      `, [userId]);
  
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch your reviews' });
    }
  });

router.put('/users/:userId/reviews/:reviewId', requireUser, async (req, res) => {
    const { userId, reviewId } = req.params;
    const { text, rating } = req.body;
  
    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
  
    try {
      const result = await client.query(`
        UPDATE reviews
        SET text = $1,
            rating = $2,
            updated_at = NOW()
        WHERE id = $3 AND user_id = $4
        RETURNING *
      `, [text, rating, reviewId, userId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Review not found or not yours' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update review' });
    }
  });


router.delete('/users/:userId/reviews/:reviewId', requireUser, async (req, res) => {
    const { userId, reviewId } = req.params;
  
    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
  
    try {
      const result = await client.query(`
        DELETE FROM reviews
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `, [reviewId, userId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Review not found or not yours' });
      }
  
      res.json({ message: 'Review deleted', deleted: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  });






module.exports = router;