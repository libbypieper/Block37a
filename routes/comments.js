const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/comments/me', requireUser, async (req, res) => {
    const userId = req.user.id;
  
    try {
      const result = await client.query(`
        SELECT * FROM comments
        WHERE user_id = $1
        ORDER BY created_at DESC
      `, [userId]);
  
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch user comments' });
    }
  });


router.post('/items/:itemId/reviews/:reviewId/comments', requireUser, async (req, res) => {
    const { reviewId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
  
    try {
      const result = await client.query(`
        INSERT INTO comments (user_id, review_id, text)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [userId, reviewId, text]);
  
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to post comment' });
    }
  });


router.put('/users/:userId/comments/:commentId', requireUser, async (req, res) => {
    const { userId, commentId } = req.params;
    const { text } = req.body;
  
    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
  
    try {
      const result = await client.query(`
        UPDATE comments
        SET text = $1, updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING *
      `, [text, commentId, userId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Comment not found or not yours' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update comment' });
    }
  });

router.delete('/users/:userId/comments/:commentId', requireUser, async (req, res) => {
    const { userId, commentId } = req.params;
  
    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
  
    try {
      const result = await client.query(`
        DELETE FROM comments
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `, [commentId, userId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Comment not found or not yours' });
      }
  
      res.json({ message: 'Comment deleted', deleted: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  });

module.exports = router;