const fetch = require('node-fetch'); 
var express = require('express');
const router = express.Router();
require('dotenv').config();
const db = require("../postgreSQL/database");


router.get('/api/profile/:id/', async (req, res) => {
    try {
        const userId = req.params.id; 
        const query = 'SELECT * FROM user_profile WHERE user_id = $1';
        const profile = await db.query(query, [userId]);

        res.json(profile[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.post('/api/updateProfile/:id/', async (req, res) => {
    try {
        const userId = req.params.id;
        console.log("userid: " + userId)

        const { username, age, mbti, gpt_intro} = req.body; 
        console.log("profile.js: "+gpt_intro)  

        const updateQuery = 'UPDATE user_profile SET username = $1, age = $2, mbti = $3, gpt_intro = $4 WHERE user_id = $5';
        await db.query(updateQuery, [username, age, mbti, gpt_intro, userId]);

        const selectQuery = 'SELECT * FROM user_profile WHERE user_id = $1';
        const updatedProfile = await db.query(selectQuery, [userId]);

        console.log("update: " + updatedProfile)
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/api/updateGPTIntro/:id/', async (req, res) => {
    try {
        const userId = req.params.id;
        console.log("userid: " + userId)

        const {gpt_intro} = req.body; 
        console.log("profile.js: "+gpt_intro)  

        const updateQuery = 'UPDATE user_profile SET gpt_intro = $1 WHERE user_id = $2';
        await db.query(updateQuery, [gpt_intro, userId]);
        
        const selectQuery = 'SELECT gpt_intro FROM user_profile WHERE user_id = $1';
        const updatedProfile = await db.query(selectQuery, [userId]);

        console.log("update: " + updatedProfile)
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
module.exports = router;