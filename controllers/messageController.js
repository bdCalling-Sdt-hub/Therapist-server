const Response = require("../helpers/response");
const Message = require("../models/Message");

//Timestamp function for socket
const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

//Save message to database
const saveMessage = (msg) => {
    Message.create({
        message: msg.message,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        chatId: msg.chatId,
        sendTime: getCurrentTime()
    });
};

const getUserSpecificChat = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const messages = await Message.find({ chatId: chatId });
        console.log(messages);
        res.status(200).json(Response({ messages: "Message get succesfully", statusCode: 200, status: "Okay", data: messages }));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCurrentTime, saveMessage, getUserSpecificChat };