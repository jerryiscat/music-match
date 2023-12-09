const fetch = require('node-fetch'); 
var express = require('express');
const router = express.Router();
const server = require('http').createServer();

require('dotenv').config();

var url = process.env.VITE_FRONTEND_URL;

const io = require('socket.io')(server, {
    cors: {
        origin: [url]
    }
});

require('dotenv').config();

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

module.exports = router;
