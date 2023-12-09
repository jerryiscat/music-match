const fetch = require('node-fetch'); 
var express = require('express');
const router = express.Router();
require('dotenv').config();
const db = require("../postgreSQL/database");
const multer = require('multer');

const upload = multer();

router.get('/', async (req, res) => {
    try {
        const query = `SELECT user_post.*, user_profile.username
                        FROM 
                            user_post
                        JOIN 
                            user_profile ON user_post.user_id = user_profile.user_id
                        WHERE 
                            user_post.is_private = FALSE;`;

                         
        const posts = await db.query(query, []);
        console.log("those are posts");
        console.log(posts);
        res.json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.post('/create/', upload.none(), async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const text = req.body.text;
        const is_private = req.body.is_private;
        const created_date = req.body.created_date;

        console.log("user_id: "+ user_id)
        console.log("text: "+text)
        console.log("private: "+ is_private)
        console.log("create time: "+ created_date)

        const query = `
            INSERT INTO user_post("user_id", "created_date", "text", "is_private")
            VALUES ($1, $2, $3, $4)
            RETURNING *;`;
        const post = await db.query(query, [user_id, created_date, text, is_private]);
        console.log("post weifan created:");
        console.log(post);
        
        res.json(post[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'An error occurred', details: error.message });
    }
});

router.get('/profile/:id', async (req, res) => {
    try {
        // Express.js logic...
        res.json();
    } catch (error) {
        res.status(500).send(error.message);
    }
});




router.get('/:id/like', async (req, res) => {
    try {
        // Express.js logic...
        res.json();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/:id/comment', async (req, res) => {
    try {
        // Express.js logic...
        res.json({ post: serializedPost });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.delete('/:id/delete/', async (req, res) => {
    try {
        const postId = req.params.id;

        const query = 'DELETE FROM user_post WHERE post_id = $1';

        await db.query(query, [postId]);

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'An error occurred', details: error.message });
    }
});



module.exports = router;

