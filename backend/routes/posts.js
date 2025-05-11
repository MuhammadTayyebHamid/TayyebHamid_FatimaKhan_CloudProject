const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, u.username, u.profile_image_url 
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a post by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, u.username, u.profile_image_url 
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, featured_image_url } = req.body;
    
    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const result = await db.query(`
      INSERT INTO posts (title, content, featured_image_url, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [title, content, featured_image_url, req.user.id]);
    
    // Get the username for the response
    const userResult = await db.query(`
      SELECT username, profile_image_url FROM users WHERE id = $1
    `, [req.user.id]);
    
    const post = { 
      ...result.rows[0], 
      username: userResult.rows[0].username,
      profile_image_url: userResult.rows[0].profile_image_url
    };
    
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a post
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, featured_image_url } = req.body;
    
    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    // Check if post exists and belongs to user
    const postCheck = await db.query(
      'SELECT * FROM posts WHERE id = $1',
      [req.params.id]
    );
    
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (postCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    
    const result = await db.query(`
      UPDATE posts
      SET title = $1, content = $2, featured_image_url = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND user_id = $5
      RETURNING *
    `, [title, content, featured_image_url, req.params.id, req.user.id]);
    
    // Get the username for the response
    const userResult = await db.query(`
      SELECT username, profile_image_url FROM users WHERE id = $1
    `, [req.user.id]);
    
    const post = { 
      ...result.rows[0], 
      username: userResult.rows[0].username,
      profile_image_url: userResult.rows[0].profile_image_url
    };
    
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if post exists and belongs to user
    const postCheck = await db.query(
      'SELECT * FROM posts WHERE id = $1',
      [req.params.id]
    );
    
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (postCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    await db.query(
      'DELETE FROM posts WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;