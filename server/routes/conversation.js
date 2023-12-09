const fetch = require('node-fetch'); 
var express = require('express');
const router = express.Router();
require('dotenv').config();
const db = require("../postgreSQL/database");

router.get('/api/getConversation', async (req, res) => {
    try {
        const current_id = req.query.id
        const query = `SELECT c.conversation_id,
                    CASE WHEN c.user_1 = $1 THEN u2.username ELSE u1.username END AS other_user,
                    CASE WHEN c.user_1 = $1 THEN u2.user_id ELSE u1.user_id END AS other_id
                    FROM conversation_user c
                    JOIN user_profile u1 ON c.user_1 = u1.user_id
                    JOIN user_profile u2 ON c.user_2 = u2.user_id
                    WHERE c.user_1 = $1 OR c.user_2 = $1;`;
        const friends = await db.query(query, [current_id]);
        res.send(friends);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'An error occurred', details: error.message });
    }
});

router.get('/api/getMessages', async (req, res) => {
    try {
        const conversation_id = req.query.conversation_id
        const query = `SELECT message_text as content, send_time as time, user_id
                    FROM message as user_message
                    WHERE user_message.conversation_id = $1`;
        const messages = await db.query(query, [conversation_id]);
        res.send(messages);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'An error occurred', details: error.message });
    }
});

router.post('/api/addMessage', async (req, res) => {
    try {
        const message = req.body.message;
        const conversation_id = req.body.conversation_id;
        const query = `INSERT INTO message("message_text", "conversation_id", "send_time", "user_id")
                        VALUES ($1, $2, $3, $4);`;
        const messages = await db.query(query, [message.content, conversation_id, message.time, message.user_id]);
        res.send(messages);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'An error occurred', details: error.message });
    }
});

router.post('/api/addFriend', async (req, res) => {
    try {
        const friend = req.body.friends_id;
        const user = req.body.current_id;
        console.log('friend', friend)
        console.log('user', user);
        const query = 'INSERT INTO conversation_user("user_1", "user_2") VALUES ($1, $2)';
        const addFriend = await db.query(query, [user, friend]);
        res.send(addFriend);
    } catch(error) {
        console.error('Error', error);
        res.status(500).send({ error: 'An error occurred', details: error.message });
    }
});

router.get('/test', async (req, res) => {
    try {
        res.send("test success!");
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'An error occurred', details: error.message });
    }
});

module.exports = router;