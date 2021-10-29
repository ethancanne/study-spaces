const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const Validator = require("../Validator.js");

/**
* Used to define the database schema for storing conversations.
* @property {String} messages The messages in the conversation.
* @property {String} participants The two user's that the conversation is between.
* @author Cameron Burkholder
* @date   10/29/2021
*/
const ConversationSchema = new Schema({
  messages: {
    type: [String],
    required: true
  },
  participants: {
    type: [String],
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
  *
  */
  static async create() {

  }

  /**
  * Deletes the conversation.
  * @return {Boolean} True if the conversation was deleted, false otherwise.
  *
  */
  async delete() {

  }

  /**
  * Gets a conversation based on the participants that it includes.
  * @param {String[]} participants The list of participants for the conversation.
  * @return {Conversation} The conversation between the participants.
  *
  */
  static async getByParticipants(participants) {

  }

  /**
  * Gets the other participant in the conversation.
  * @param {User} participant The first participant in the conversation.
  * @return {User} The other participant in the conversation.
  *
  */
  getOtherParticipant(participant) {

  }

  /**
  * Gets the messages of a conversation.
  * @return {Message[]} A list of messages between the two participants.
  *
  */
  async getMessages() {

  }

  /**
  * Updates the conversation in the database.
  * @return {Boolean} True if the conversation was saved, false otherwise.
  *
  */
  async save() {

  }

  /**
  * Sends a message.
  * @param {Message} message The message to send.
  * @return {Boolean} True if the message was sent, false otherwise.
  *
  */
  async sendMessage(message) {

  }

}

module.exports = User;
