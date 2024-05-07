const { createServer } = require('node:http');
const { Server } = require('socket.io');
// const mongoose = require('mongoose');
// const { ObjectId } = mongoose.Types;

const app = require('../app');
const { connectToDatabase } = require('../helpers/connection');
const { getCurrentTime, saveMessage, createChat } = require('./messageController');
const Chat = require('../models/Chat');

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

        socket.on('message', async (msg, callback) => {
            try {
                // Send message to specific user
                io.emit(`new::${msg.chatId}`, msg);
                console.log(msg);

                // Search for existing chat between sender and receiver
                const searchChat = await Chat.findOne({ senderId: msg.senderId, receiverId: msg.receiverId });

                // If chat does not exist, create a new one
                if (!searchChat) {
                    // Create chat
                    const newChat = await createChat(msg);
                    msg.chatId = newChat._id;
                } else {
                    msg.chatId = searchChat._id;
                }

                // Save message
                await saveMessage(msg);

                // Response back
                callback({
                    message: msg,
                    type: "Message",
                });
            } catch (error) {
                console.error(error);
                // Handle errors here
                callback({
                    error: "An error occurred while processing the message",
                    type: "Error",
                });
            }
        });


    });
};

module.exports = socketIO;

