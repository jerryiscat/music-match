const express = require('express');
const router = express.Router();
const db = require('../postgreSQL/database');

router.get('/', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query.trim()) {
            return res.status(400).json({ message: "Search query is empty" });
        }

        const userResults = await db.query('SELECT * FROM user_profile WHERE username ILIKE $1', [`%${query}%`]);
        console.log('users found', userResults);

        res.json({
            users: userResults,
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).send('An error occurred during the search.');
    }
});

module.exports = router;
