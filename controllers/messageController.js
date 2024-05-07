const { response } = require("../app");
const Response = require("../helpers/response");
const Chat = require("../models/Chat");
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

const createChat = async (msg) => {
    Chat.create({
        senderId: msg.senderId,
        receiverId: msg.receiverId
    });
};

// const getUserSpecificChat = async (req, res) => {
//     try {
//         // const chatId = req.params.chatId;
//         const receiverId = req.params.receiverId;
//         const senderId = req.body.userId;
//         const messages = await Message.find({ chatId: chatId });
//         console.log(messages);
//         res.status(200).json(Response({ messages: "Message get succesfully", statusCode: 200, status: "Okay", data: messages }));
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const getUserSpecificChat = async (req, res) => {
    try {
        const receiverId = req.params.receiverId;
        const senderId = req.body.userId;
        console.log(receiverId, senderId);
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        });

        res.status(200).json(Response({
            data: messages,
            statusCode: 200,
            status: "Okay",
            message: "Messages retrieved successfully"
        }));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getChatList = async (req, res) => {
    try {
        const userId = req.body.userId;

        // Find chats where the senderId matches the userId
        const chats = await Chat.find({ senderId: userId })
            .populate({
                path: 'receiverId',
                select: '-phone -countryCode' // Exclude phone and countryCode fields
            });
        console.log('jjwoeiffjoif', chats[0].receiverId._id);

        const lastMessage = await Message.findOne({ receiverId: chats[0].receiverId._id });
        console.log('lastMessage', lastMessage);
        chats.push({ lastMessage: lastMessage });


        res.status(200).json(Response({ data: chats, statusCode: 200, status: "Okay", message: "Chat list retrieved successfully" }));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { getCurrentTime, saveMessage, createChat, getUserSpecificChat, getChatList };