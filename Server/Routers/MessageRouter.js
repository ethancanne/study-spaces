const Authenticator = require("../Authenticator.js");
const Configuration = require("../../Configuration.js");
const Conversation = require("../Models/Conversation.js");
const Events = require("../Events.js");
const Log = require("../Log.js");
const PrivacySettings = require("../Models/PrivacySettings.js");
const ResponseCodes = require("../Responses/ResponseCodes.js");
const ResponseMessages = require("../Responses/ResponseMessages.js");
const Routes = require("../Routes/Routes.js");
const StudyGroup = require("../Models/StudyGroup.js");
const Validator = require("../Validator.js");
const User = require("../Models/User.js");

/**
 * The router used to serve account-related requests.
 * @author Clifton Croom
 * @date   03/09/2022
 */
class MessageRouter {
    /**
     * Initialize the router and serve the routes.
     * @param {Server} server The server instance used to provide the routes.
     * @param {Authenticator} authenticator The authenticator used to protect the routes.
     * @author Clifton Croom
     * @date   03/09/2022
     * @static
     */
    static serveRoutes(server, authenticator, io) {
        // EXPOSE THE SOCKET.IO HANDLERS.
        MessageRouter.userIdToSocketIdMap = {};
        MessageRouter.io = io;
        io.on(Events.Connect, MessageRouter.handleConnection);
        io.on(Events.Disconnect, MessageRouter.handleDisconnect);
        io.on(Events.Error, MessageRouter.handleError);
        // Implement security middleware.
        io.use(MessageRouter.socketAuthenticationMiddleware);

        // EXPOSE THE ROUTE HANDLERS.
        // This is used to get a conversation.
        server.post(Routes.Message.GetConversation, authenticator.protectRoute(), MessageRouter.getConversation);
        // Used to get all of a users conversations.
        server.post(Routes.Message.GetConversations, authenticator.protectRoute(), MessageRouter.getConversations);
        // Used to create a conversation.
        server.post(Routes.Message.CreateConversation, authenticator.protectRoute(), MessageRouter.createConversation);
    }

    // SOCKET.IO HANDLERS.
    /**
    * Sends a message between two users.
    * @param {Object} - { message, receiverId }.
    * @author Cameron Burkholder
    * @date   03/14/2022
    * @async
    * @static
    */
    static async broadcastMessage({ message, receiverId }, socket) {
        // BROADCAST THE MESSAGE TO BOTH PARTIES.
        const senderId = socket.userId;
        const senderSocketId = MessageRouter.convertUserIdToSocketId(senderId);
        const receiverSocketId = MessageRouter.convertUserIdToSocketId(receiverId);
        MessageRouter.io.to(receiverSocketId).emit(Events.Message, {
            message,
            senderId: senderId
        });
        MessageRouter.io.to(senderSocketId).emit(Events.Message, {
            message,
            senderId: senderId
        });

        // STORE THE MESSAGE IN THE CONVERSATION.
        const conversation = await Conversation.getByParticipantIds(senderId, receiverId);
        const conversationWasFound = Validator.isDefined(conversation);
        if (!conversationWasFound) {
            return MessageRouter.io.to(senderSocketId).emit(Events.MessageFailure, "The conversation could not be found.");
        }
        const messageWasSent = await conversation.sendMessage(message, senderId, receiverId);
        if (!messageWasSent) {
            return MessageRouter.io.to(senderSocketId).emit(Events.MessageFailure, "Unable to save the message to the database.");
        }
    }

    /**
     *
     * @param {String} request.user The user sending messages
     * @param {String} request.body.receiverId The user recieving messages
     * @returns
     */

    static async createConversation(request, response) {
        //Check for duplicates

        let userId = String(request.user.getId());
        let receiverId = request.body.receiverId;
        console.log(userId);
        console.log(receiverId);
        let conversationExists = undefined;
        conversationExists = await Conversation.getByParticipantIds(userId, receiverId);
        console.log(conversationExists);
        if (Validator.isDefined(conversationExists)) {
            return response.json({ message: ResponseMessages.Message.ErrorConversationExists });
        }


        //GET RECEIVER BY ID
        let receiver = undefined;
        receiver = await User.getById(receiverId);
        const receiverFound = Validator.isDefined(receiver);
        if (!receiverFound) {
            return response.json({ message: ResponseMessages.Message.ErrorGetReceiver });
        }
       
        // CREATE NEW CONVERSATION
        let newConversation = undefined;
        try {
            newConversation = await Conversation.create(userId, receiverId);
        } catch (error) {
            Log.writeError(error);
        }

        // VALIDATE STUDY GROUP CREATION.
        const conversationCreated = Validator.isDefined(newConversation);
        if (!conversationCreated) {
            return response.json({ message: ResponseMessages.Message.ErrorCreateConversation });
        } else {
            // ADD CONVERSATION TO USERS
            let addToReceiver = false;
            let addToSender = false;
            let conversationId = newConversation.getId();
            try {
                
                addToReceiver = await request.user.addConversation(conversationId);
                addToSender = await receiver.addConversation(conversationId);
            } catch (error) {
            Log.writeError(error);
            }
            if (addToReceiver && addToSender) {
                return response.json({ message: ResponseMessages.Message.SuccessCreateConversation });
            } else {
                return response.json({ message: ResponseMessages.Message.ErrorAddConversation });
            }
        }
    }


    /**
    * Converts a user's document ID to a socket ID if one exists.
    * @param {Mongoose.Types.ObjectId} userId The user ID being converted.
    * @return {String} The socket ID, if it exists.
    */
    static convertUserIdToSocketId(userId) {
        const convertedUserId = userId;
        const socketId = MessageRouter.userIdToSocketIdMap[convertedUserId];
        return socketId;
    }
    static handleConnection(socket) {
        // STORE THE SOCKET INSTANCE.
        MessageRouter.userIdToSocketIdMap[socket.handshake.auth.id] = socket.id;

        // PROVIDE THE APPROPRIATE MESSAGE HANDLER.
        socket.on(Events.Message, (args) => { MessageRouter.broadcastMessage(args, socket) });
        // If the application is being run in development, log all events to the console.
        if (!Configuration.isSetToProduction()) {
            socket.onAny((event, ...args) => {
                Log.write(`Socket.IO: ${event}.`);
                Log.write(`SenderID: ${socket.handshake.auth.id}.`);
                Log.write(args);
            });
        }
    }
    static handleDisconnect(socket) {}
    static handleError(error) {
        Log.write("A Socket.IO error occurred.");
        Log.writeError(error);
    }
    static socketAuthenticationMiddleware(socket, nextMiddlewareFunction) {
        const userId = String(socket.handshake.auth.id);
        const userIdExists = Validator.isDefined(userId);
        if (userIdExists) {
            socket.userId = userId;
            return nextMiddlewareFunction();
        } else {
            return nextMiddlewareFunction(new Error(Events.InvalidUserId));
        }
    }

    // ROUTE HANDLERS.
    /**
     * Gets the conversation of two users.
     * @param {String} request.body.receiverId The ID of the person receiving messages.
     * @author Clifton Croom
     * @date   03/09/2022
     * @async
     * @static
     */
    static async getConversation(request, response) {
        let conversation = undefined;
        const senderId = request.user.getId();
        const receiverId = request.body.receiverId;
        try {
            conversation = await Conversation.getByParticipantIds(senderId, receiverId);
        } catch (error) {
            Log.writeError(error);
        } finally {
            if (Validator.isDefined(conversation)) {
                response.json({
                    message: ResponseMessages.Message.SuccessGetConversation,
                    conversation: conversation
                });
            } else {
                response.json({ message: ResponseMessages.Message.ErrorGetConversation });
            }
        }
    }

    /**
     * Gets all conversations for a user.
     * @author Cameron Burkholder
     * @date   03/15/2022
     * @async
     * @static
     */
    static async getConversations(request, response) {
        // GET ALL CONVERSATIONS FOR A USER.
        const userId = request.user.getId();
        const conversations = await Conversation.getAllForUserById(userId);
        const conversationsWereFound = Validator.isDefined(conversations);
        if (conversationsWereFound) {
            return response.json({
                conversations: conversations,
                message: ResponseMessages.Message.GetConversations.Success
            });
        } else {
            return response.json({ message: ResponseMessages.Message.GetConversations.Error });
        }
    }
}

module.exports = MessageRouter;
