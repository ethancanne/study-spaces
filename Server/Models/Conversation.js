const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Configuration = require("../../Configuration.js");
const Message = require("./Message.js");
const Log = require("../Log.js");
const Validator = require("../Validator.js");

/**
 * Used to define the database schema for storing conversations.
 * @author Cameron Burkholder
 * @date   10/29/2021
 */
const ConversationSchema = new Schema({
    messages: {
        type: [Mongoose.Schema.Types.ObjectId],
        ref: Configuration.getMessageCollectionName(),
        required: true
    },
    participants: {
        type: [Mongoose.Schema.Types.ObjectId],
        ref: Configuration.getUserCollectionName(),
        required: true
    }
});
ConversationSchema.set("toObject", {
    versionKey: false,
    transform: (document, object) => {
        delete object.__v;
        return object;
    }
});
const conversationCollectionName = Configuration.getConversationCollectionName();
const ConversationModel = Mongoose.model(conversationCollectionName, ConversationSchema);

/**
 * Provides an interface for working with conversations in the database.
 * @property {Mongoose.Schema.Types.ObjectId[]} messages The messages in the conversation.
 * @property {Mongoose.Schema.Types.ObjectId[]} participants The people in the conversation.
 * @author Cameron Burkholder
 * @date   10/29/2021
 */
class Conversation {
    /**
     * Initializes the conversation passed in from the database.
     * @param  {Mongoose.Schema} conversationSchema The database record for a given conversation.
     * @author Cameron Burkholder
     * @date   10/29/2021
     */
    constructor(conversationSchema) {
        // COPY THE DATABASE INSTANCE TO THE MODEL INSTANCE.
        // In order to maximize the usability of this class, the attributes stored in the database
        // record are copied to the instance of this class so they can be properly editied.
        // The conversation schema is converted to a regular object to sanitize it of wrapper methods and properties.
        Object.assign(this, conversationSchema.toObject());
    }

    /**
     * Creates a conversation between two participants.
     * @param {User} sender The user sending the first message in the conversation.
     * @param {User} receiver The user receiving the first message in the conversation.
     * @return {Conversation} The conversation created.
     * @author Clifton Croom
     * @date 03/21/22
     * @async
     * @static
     */
    static async create(sender, receiver) {
        const conversationModel = new ConversationModel({
            messages: [],
            participants: [sender, receiver]
        });
        
        let conversationWasSaved = false;
        try {
            conversationWasSaved = await conversationModel.save();
        } catch (error) {
            Log.write("An error occurred while attempting to create a conversation.");
            Log.writeError(error);
        } finally {
            if (conversationWasSaved) {
                const conversation = new Conversation(conversationModel);
                return conversation;
            } else {
                return undefined;
            }
        }

    }

    /**
     * Deletes the conversation.
     * @return {Boolean} True if the conversation was deleted, false otherwise.
     *
     * @async
     */
    async delete() {}

    /**
     * Gets all conversations for a given user.
     * @param {Mongoose.Types.ObjectId} userId The ID of the user to find conversations for.
     * @return {Conversation[]} The conversations between the participants.
     * @author Cameron Burkholder
     * @date   03/16/2022
     * @async
     * @static
     */
    static async getAllForUserById(userId) {
        let conversationModels = undefined;
        try {
            conversationModels = await ConversationModel.find({ participants: userId });
        } catch (error) {
            Log.write("An error occurred while attempting to get all conversations for a user.");
            Log.writeError(error);
        } finally {
            const conversationsWereFound = Validator.isDefined(conversationModels);
            if (conversationsWereFound) {
                // FILL IN THE CONVERSATION DATA.
                let conversationIndex = 0;
                const conversationCount = conversationModels.length;
                let conversations = [];
                while (conversationIndex < conversationCount) {
                    const conversationModel = conversationModels[conversationIndex];
                    await conversationModel.populate("participants");
                    const conversation = new Conversation(conversationModel);
                    conversations.push(conversation);
                    conversationIndex++;
                }
                return conversations;
            } else {
                return undefined;
            }
        }
    }

    /**
     * Gets a conversation based on the participants that it includes.
     * @param {Mongoose.Types.ObjectId} senderId The ID of the user sending the message.
     * @param {Mongoose.Types.ObejctId} receiverId The ID of the user receiving the message.
     * @return {Conversation} The conversation between the participants.
     * @author Cameron Burkholder
     * @date   03/14/2022
     * @async
     * @static
     */
    static async getByParticipantIds(senderId, receiverId) {
        let conversationModel = undefined;
        try {
            conversationModel = await ConversationModel.findOne({ participants: {
                $all: [senderId, receiverId]
            }});
        } catch (error) {
            Log.write("An error occurred while attempting to get a conversation by its participants.");
            Log.writeError(error);
        } finally {
            const conversationWasFound = Validator.isDefined(conversationModel);
            if (conversationWasFound) {
                await conversationModel.populate("participants");
                await conversationModel.populate("messages");
                const conversation = new Conversation(conversationModel);
                return conversation;
            } else {
                return undefined;
            }
        }
    }

    /**
     * Gets the other participant in the conversation.
     * @param {User} participant The first participant in the conversation.
     * @return {User} The other participant in the conversation.
     *
     */
    getOtherParticipant(participant) {}

    /**
     * Gets the messages of a conversation.
     * @return {Message[]} A list of messages between the two participants.
     *
     * @async
     */
    async getMessages() {}

    /**
     * This saves the associated conversation document in the database with the current properties
     * stored in this object.
     * @return {bool} True if the conversation was saved, false if the conversation wasn't saved.
     * @author Cameron Burkholder
     * @date   03/16/2021
     * @async
     */
    async save() {
        let conversationWasSaved = false;
        try {
            // GET THE DATABASE INSTANCE OF THE USER.
            let conversationModel = await ConversationModel.findOne({ _id: this._id }).exec();

            // UPDATE THE DATABASE INSTANCE WITH THE CURRENT USER PROPERTIES.
            Object.assign(conversationModel, this);

            // SAVE THE UPDATED DATABASE INSTANCE.
            await conversationModel.save();
            conversationWasSaved = true;
        } catch (error) {
            Log.write("An error occurred while attempting to retrieve the conversation to save.");
            Log.writeError(error);
        } finally {
            return conversationWasSaved;
        }
    }

    /**
     * Sends a message.
     * @param {String} message The message to send.
     * @param {Mongoose.Types.ObjectId} senderId The user ID of the sender.
     * @param {Mongoose.Types.ObjectId} receiverId The user ID of the receiver.
     * @return {Boolean} True if the message was sent, false otherwise.
     *
     * @async
     */
    async sendMessage(messageValue, senderId, receiverId) {
        // CREATE THE MESSAGE.
        const message = await Message.create(this._id, senderId, messageValue);
        const messageWasCreated = Validator.isDefined(message);
        if (!messageWasCreated) {
            return false;
        }

        // STORE THE MESSAGE IN THE CONVERSATION.
        this.messages.push(message.getId());
        let conversationWasSaved = false;
        try {
            conversationWasSaved = await this.save();
        } catch (error) {
            Log.write("An error occurred while attempting to add a message to the conversation.");
            Log.writeError(error);
        } finally {
            return conversationWasSaved;
        }
    }

    /**
     * Gets the document id of the conversation in the database as a string.
     * @return {Mongoose.Types.ObjectId} The document id of the conversation.
     * @author Clifton Croom
     * @date   03/21/22
     */
         getId() {
            return this._id;
        }
}

module.exports = Conversation;
