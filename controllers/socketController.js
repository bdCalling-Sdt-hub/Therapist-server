const { createServer } = require('node:http');
const { Server } = require('socket.io');
// const mongoose = require('mongoose');
// const { ObjectId } = mongoose.Types;

const app = require('../app');
const { connectToDatabase } = require('../helpers/connection');
const { getCurrentTime, saveMessage } = require('./messageController');
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

// Connect to the MongoDB database
connectToDatabase();


const socketIO = (io) => {
    console.log("Socket server is lenening on port 300")
    io.on('connection', (socket) => {
        console.log(`${getCurrentTime()} New client connected`);

        socket.on('disconnect', () => {
            console.log(`${getCurrentTime()} Client disconnected`);
        });

        socket.on('message', (msg, callback) => {
            //send message to specific user
            io.emit(`new::${msg.chatId}`, msg);
            console.log(msg);

            // save message to database and call a function
            saveMessage(msg)

            //response back
            callback(
                {
                    message: msg,
                    type: "Message",
                }
            )
        });

    });
};

module.exports = socketIO;

