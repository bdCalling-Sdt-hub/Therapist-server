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

// const getUserSpecificChat = async (req, res) => {
//     try {
//         // const chatId = req.params.chatId;
//         const participant = req.params.participant;
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


// const getChatList = async (req, res) => {
//     try {
//         const userId = req.body.userId;
//         console.log(userId)

//         // Find chats where the senderId matches the userId
//         const chats = await Chat.find({
//             $or: [
//                 { senderId: userId },
//                 { participant: userId },
//             ]
//         }).populate('participant');

//         // Get the last message for each chat
//         const messages = await Message.aggregate([
//             { $match: { chatId: { $in: chats.map(chat => chat._id) } } },
//             { $sort: { createdAt: -1 } }, // Sort messages by createdAt field in descending order
//             {
//                 $group: {
//                     _id: '$chatId',
//                     lastMessage: { $first: '$$ROOT' } // Get the first message for each chat (which is actually the last message due to sorting)
//                 }
//             }
//         ]);

//         // Combine chats with their respective last messages
//         const chatList = chats.map(chat => {
//             const lastMessage = messages.find(group => group._id.equals(chat._id));
//             return { chat, lastMessage: lastMessage ? lastMessage.lastMessage : null };
//         });

//         res.status(200).json(Response({ data: chatList, statusCode: 200, status: "Okay", message: "Chat list retrieved successfully" }));
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

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
        console.log(chats)

        // Extract participant IDs from chats
        const participantIds = chats.map(chat => chat.participant);
        console.log(participantIds)

        // Find messages where senderId matches and participant is in the extracted participantIds
        const messages = await Message.find({
            $or: [
                { senderId: senderId },
                { participant: { $in: participantIds } }
            ]
        }).sort({ createdAt: -1 }).populate('participant');

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// const getChatList = async (req, res) => {
//     try {
//         const senderId = req.body.userId;
//         const chats = await Chat.find({
//             $or: [
//                 { senderId: senderId },
//                 { participant: senderId }
//             ]
//         });

//         // Find latest message
//         const message = await Message.findOne({
//             $or: [
//                 { senderId: senderId },
//                 { participant: senderId },
//             ]
//         }).sort({ createdAt: -1 });

//         // Prepare JSON response
//         const jsonResponse = {
//             // user: user,
//             chat: chats,
//             lastMessage: message
//         };

//         res.status(200).json(Response({ data: jsonResponse }));

//         console.log(chats)
//         console.log(message)
//     } catch {
//         res.status(500).json(Response({ message: "Internal servr error" }))
//     }
// }





module.exports = { getCurrentTime, saveMessage, createChat, getUserSpecificChat, getChatList };