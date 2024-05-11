const { mongoose } = require("mongoose");
const { response } = require("../app");
const Response = require("../helpers/response");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

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
    const saveMessage = Message.create({
        message: msg.message,
        senderId: msg.senderId,
        participant: msg.participant,
        chatId: msg.chatId,
        sendTime: getCurrentTime()
    });
    return saveMessage;
};

const createChat = async (msg) => {
    const newChat = Chat.create({
        senderId: msg.senderId,
        participant: msg.participant
    });
    return newChat;
};

const getUserSpecificChat = async (req, res) => {
    try {
        const search = req.query.search || ""; // Ensure search is not undefined
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const participant = req.params.participant;
        const senderId = req.body.userId;

        // Find messages where senderId and participant match, or vice versa
        const query = {
            $or: [
                { senderId: senderId, participant: participant },
                { senderId: participant, participant: senderId }
            ]
        };

        // Count total number of messages
        const totalMessages = await Message.countDocuments(query);

        // Fetch messages with pagination
        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        res.status(200).json(Response({
            data: messages,
            pagination: {
                totalPages: Math.ceil(totalMessages / limit),
                currentPage: page,
                totalMessages: totalMessages,
            },
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
        const senderId = req.body.userId;

        // Find chat
        const chats = await Chat.find({
            $or: [
                { senderId: senderId },
                { participant: senderId },
            ]
        });

        // Extract chat IDs
        const chatIds = chats.map(chat => chat._id);

        // Group messages by chatId and retrieve only the last message for each chat
        const chatMessages = await Message.aggregate([
            {
                $match: { chatId: { $in: chatIds } }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: "$chatId",
                    lastMessage: { $first: "$$ROOT" }
                }
            }
        ]);



        // Combine chats with their last messages
        const chatList = await Promise.all(chats.map(async chat => {
            const chatMessagesObj = chatMessages.find(msg => msg._id.toString() === chat._id.toString());
            let participant;
            if (chat.senderId.toString() === senderId) {
                participant = chat.participant;
            } else {
                participant = chat.senderId;
            }
            const participantDetails = await User.findById(participant);
            return {
                chat: chat,
                participantDetails: participantDetails,
                lastMessage: chatMessagesObj ? chatMessagesObj.lastMessage : null,
            };
        }));

        // Now you can send the chatList in the response
        res.status(200).json(Response({ data: chatList }));

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};






module.exports = { getCurrentTime, saveMessage, createChat, getUserSpecificChat, getChatList };