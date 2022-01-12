const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

/**
 * @author Cliff Croom
 * @date   01/11/2022
 */
const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        required: true
    },
    attachment: {
        type: String,
        required: false
    },
    responses: {
        type: [[String][String]],
        required: false
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
 * 
 * @author Cliff Croom
 * @date   01/11/2021
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
     */
    async delete() {}

    /**
     * Saves the post.
     * @return {Boolean} True if the post was saved, false otherwise.
     *
     */
    async save() {}

    
    /**
     * Gets the title.
     * @return {String} The title of the post.
     *
     */
    getTitle() {}

    /**
     * Gets the message.
     * @return {String} The message of the post.
     *
     */
    getMessage() {}

    /**
     * Gets the Type.
     * @return {String} The type of the post.
     *
     */
    getType() {}

    /**
     * Gets the Creator's DocumentID.
     * @return {String} The Creator's DocumentID.
     *
     */
    getCreator() {}

     /**
     * Gets the attachment.
     * @return {String} The attachment of the post.
     *
     */
    getAttachment() {}

    /**
     * Gets the timestamp.
     * @return {String} The timestamp of the post.
     *
     */
    getTimestamp() {}

    /**
     * Gets the Responses array.
     * @return {[[String][String]]} The responses to the post.
     *
     */
    getResponses() {}
    
    /**
     * Sets the title.
     * @param {String} title The title to set.
     * @return {Boolean} True if the title was set, false otherwise.
     *
     */
    setTitle() {}

     /**
      * Sets the message.
      * @param {String} message The message to set.
      * @return {Boolean} True if the message was set, false otherwise.
      *
      */
    setMessage() {}
 
     /**
      * Sets the Type.
      * @param {String} type The type to set.
      * @return {Boolean} True if the type was set, false otherwise.
      *
      */
    setType() {}
 
     /**
      * Sets the Creator's DocumentID.
      * @param {String} creator The type to set.
      * @return {Boolean} True if the Creator's DocumentID was set, false otherwise.
      *
      */
    setCreator() {}
 
      /**
      * Sets the attachment.
      * @param {String} attachment The attachment to set.
      * @return {Boolean} True if the attachment was set, false otherwise.
      *
      */
    setAttachment() {}
 
     /**
      * Sets the timestamp.
      * @param {String} timestamp The timestamp to set.
      * @return {Boolean} True if the timestamp was set, false otherwise.
      *
      */
    setTimestamp() {}
 
     /**
      * Adds the Responses array.
      * @param {String} response The response to add.
      * @return {Boolean} True if the response array was set, false otherwise.
      *
      */
    addResponse() {}

    /**
      * Deletes a response.
      * @param {String} responseIndex The response to be deleted.
      * @return {Boolean} True if the response was deleted, false otherwise.
      *
      */
    deleteResponse() {}
    

}

module.exports = Post;