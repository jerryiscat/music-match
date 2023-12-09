const fetch = require('node-fetch'); 
var express = require('express');
const router = express.Router();
require('dotenv').config();
const openai = require('openai');

router.post('/api/gptintro', async (req, res) => {
    try {
        const userInput = req.body.query;
        const response = await fetch('https://api.openai.com/v1/chat/completions', 
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",

                // max_tokens: 200,
                messages: [
                    { "role": "system", "content": "You are a helpful assistant." },
                    { "role": "user", "content": userInput }
                ]
            }),
        });

        const data = await response.json();
        res.send(data.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'An error occurred', details: error.message });
    }
});''

module.exports = router;
