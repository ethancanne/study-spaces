const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

/**
 * @author Cliff Croom
 * @date   01/11/2022
 */
const PostSchema = new Schema({
    attachment: {
        type: String,
        required: false
    },
    creator: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    responses: {
        type: [Object],
        required: true
    },
    timeStamp: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});
PostSchema.set("toObject", {
    versionKey: false,
    transform: (document, object) => {
        delete object.__v;
        return object;
    }
});
const PostCollectionName = Configuration.getPostCollectionName();
const PostModel = Mongoose.model(PostCollectionName, PostSchema);

/**
 * @author Cliff Croom
 * @date   01/11/2021
 * @property {String=} attachment An optional attachment (picture or file) the user can upload.
 * @property {String} creator The document ID of the post's author.
 * @property {String} message The post's body.
 * @property {Object[]} responses A list of post responses.
 * @property {Date} timestamp The time the post was posted.
 * @property {String} title The post's title.
 * @property {String} type The type of post.
 */
class Post {
    /**
     * Initializes the post passed in from the database.
     * @param  {Mongoose.Schema} PostSchema The database record for a given post.
     * @author Cliff Croom
     * @date   01/11/2021
     */
    constructor(PostSchema) {
        Object.assign(this, PostSchema.toObject());
    }

    /**
     * Adds a response to the responses array.
     * @param {String} response The response to add.
     * @return {Boolean} True if the response array was updated, false otherwise.
     *
     * @async
     */
    async addResponse() {}

    /**
     * Creates a post.
     * @param
     * @param
     * @return {Post} The post created.
     *
     */
    static async create() {}

    /**
     * Creates a post response.
     * @param
     * @param
     * @return {Boolean} The post response created.
     *
     */
    static async createResponse() {}

    /**
     * Deletes the post.
     * @return {Boolean} True if the post was deleted, false otherwise.
     *
     * @async
     */
    async delete() {}

    /**
     * Deletes a response.
     * @param {String} responseIndex The response to be deleted.
     * @return {Boolean} True if the response was deleted, false otherwise.
     *
     * @async
     */
    async deleteResponse(responseIndex) {}

    /**
     * Gets the attachment.
     * @return {String} The attachment of the post.
     *
     */
    getAttachment() {}

    /**
     * Gets the creator's document ID.
     * @return {String} The creator's document ID.
     *
     */
    getCreator() {}

    /**
     * Gets the message.
     * @return {String} The message of the post.
     *
     */
    getMessage() {}

    /**
     * Gets the responses array.
     * @return {Object[]} The responses to the post.
     *
     */
    getResponses() {}

    /**
     * Gets the timestamp.
     * @return {String} The timestamp of the post.
     *
     */
    getTimestamp() {}

    /**
     * Gets the title.
     * @return {String} The title of the post.
     *
     */
    getTitle() {}

    /**
     * Gets the type.
     * @return {String} The type of the post.
     *
     */
    getType() {}

    /**
     * Saves the post.
     * @return {Boolean} True if the post was saved, false otherwise.
     *
     * @async
     */
    async save() {}

    /**
     * Sets the message.
     * @param {String} message The message to set.
     * @return {Boolean} True if the message was set, false otherwise.
     *
     * @async
     */
    async setMessage() {}

    /**
     * Sets the attachment.
     * @param {String} attachment The attachment to set.
     * @return {Boolean} True if the attachment was set, false otherwise.
     *
     * @async
     */
    async setAttachment() {}

    /**
     * Sets the title.
     * @param {String} title The title to set.
     * @return {Boolean} True if the title was set, false otherwise.
     *
     * @async
     */
    async setTitle() {}

    /**
     * Sets the Type.
     * @param {String} type The type to set.
     * @return {Boolean} True if the type was set, false otherwise.
     *
     * @async
     */
    async setType() {}
}

module.exports = Post;
