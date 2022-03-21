const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const Validator = require("../Validator.js");

/**
 * @author Cameron Burkholder
 * @date   10/29/2021
 */
const MessageSchema = new Schema(
    {
        conversationId: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: Configuration.getConversationCollectionName(),
            required: true
        },
        senderId: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: Configuration.getUserCollectionName(),
            required: true
        },
        value: {
            type: String,
            requird: true
        }
    },
    {
        timestamps: true
    }
);
MessageSchema.set("toObject", {
    versionKey: false,
    transform: (document, object) => {
        delete object.__v;
        return object;
    }
});
const messageCollectionName = Configuration.getMessageCollectionName();
const MessageModel = Mongoose.model(messageCollectionName, MessageSchema);

/**
 * Provides an interface for working with messages in the database.
 * Used to define the database schema for storing messages.
 * @property {String} senderName The name of the participant that sent the message.
 * @property {String} timeSent The time the message was sent.
 * @property {String} value The message value that was sent.
 * @author Cameron Burkholder
 * @date   10/29/2021
 */
class Message {
    /**
     * Initializes the conversation passed inn from the database.
     * @param  {Mongoose.Schema} messageSchema The database record for a given conversation.
     * @author Cameron Burkholder
     * @date   10/29/2021
     */
    constructor(messageSchema) {
        // COPY THE DATABASE INSTANCE TO THE MODEL INSTANCE.
        // In order to maximize the usability of this class, the attributes stored in the database
        // record are copied to the instance of this class so they can be properly editied.
        // The message schema is converted to a regular object to sanitize it of wrapper methods and properties.
        Object.assign(this, messageSchema.toObject());
    }

    /**
     * Creates a message.
     * @param {User} sender The user sending the message.
     * @param {String} value The message sent by the user.
     * @return {Message} The conversation created.
     *
     * @async
     * @static
     */
    static async create(conversationId, senderId, value) {
        const messageModel = new MessageModel({
            conversationId,
            senderId,
            value
        });
        let messageWasSaved = false;
        try {
            messageWasSaved = await messageModel.save();
        } catch (error) {
            Log.write("An error occurred while attempting to create a message.");
            Log.writeError(error);
        } finally {
            if (messageWasSaved) {
                const message = new Message(messageModel);
                return message;
            } else {
                return undefined;
            }
        }
    }

    /**
     * Deletes the message.
     * @return {Boolean} True if the message was deleted, false otherwise.
     *
     * @async
     */
    async delete() {}

    /**
     * Gets a message based on its document ID.
     * @param {String} messageId The document ID of the message to get.
     * @return {Message} The message requested.
     *
     * @async
     * @static
     */
    static async getById(messageId) {}

    /**
     * Gets the message ID.
     * @return {Mongoose.Types.ObjectId} The document ID for the message.
     * @author Cameron Burkholder
     * @date   03/16/2022
     */
    getId() {
        return this._id;
    }

    /**
     * Gets the value of the message.
     * @return {String} The value of the message.
     *
     */
    getMessageValue() {}

    /**
     * Gets the name of the person that sent the message.
     * @return {String} The name of the message sender.
     *
     */
    getSenderName() {}

    /**
     * Gets the time the message was sent.
     * @return {String} The time the message was sent.
     *
     */
    getTimeSent() {}
}

module.exports = Message;
