const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const Validator = require("../Validator.js");

/**
 * @author Cliff Croom
 * @date   01/11/2022
 */
const PostSchema = new Schema(
    {
        attachment: {
            type: String,
            required: false
        },
        creator: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: Configuration.getUserCollectionName(),
            required: true
        },
        feedId: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "Feed",
            required: true
        },
        message: {
            type: String,
            required: true
        },
        responses: {
            type: [String],
            required: false
        },
        title: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);
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
        // COPY THE DATABASE INSTANCE TO THE MODEL INSTANCE.
        // In order to maximize the usability of this class, the attributes stored in the database
        // record are copied to the instance of this class so they can be properly editied.
        // The post schema is converted to a regular object to sanitize it of wrapper methods and properties.
        Object.assign(this, PostSchema.toObject());
    }

    /**
     * Creates a post.
     * @param
     * @param
     * @return {Post} The post created.
     *
     */
    static async create(title, message, feedId, creator, type, attachment) {
        const postModel = new PostModel({
            title: title,
            message: message,
            feedId: feedId,
            creator: creator,
            type: type,
            attachment: attachment
        });
        try {
            await postModel.save();
        } catch (error) {
            console.log(error);
        }

        // RETURN THE CREATED INSTANCE.
        const post = new Post(postModel);
        return post;
    }

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
     * @async
     * @author Stacey Popenfoose
     * @date 01/13/2022
     */
    async save() {
        let postWasSaved = false;
        try {
            let postModel = await PostModel.findOne({ _id: this._id }).exec();
            Object.assign(postModel, this);
            await postModel.save();
            postWasSaved = true;
        } catch (error) {
            Log.write("An error occurred while attempting to retrieve the user to save.");
            Log.writeError(error);
        } finally {
            return postWasSaved;
        }
    }

    /**
     * Gets the title.
     * @return {String} The title of the post.
     * @author Stacey Popenfoose
     * @date 1/13/2022
     */
    getTitle() {
        return String(this.title);
    }

    /**
     * Gets the message.
     * @return {String} The message of the post.
     * @author Stacey Popenfoose
     * @date 1/13/2022
     */
    getMessage() {
        return String(this.message);
    }

    /**
     * Gets the Type.
     * @return {String} The type of the post.
     * @author Stacey Popenfoose
     * @date 1/13/2022
     */
    getType() {
        return String(this.type);
    }

    /**
     * Gets the Creator's DocumentID.
     * @return {String} The Creator's DocumentID.
     * @author Stacey Popenfoose
     * @date 1/13/2022
     */
    getCreator() {
        return String(this.creator);
    }

    /**
     * Gets the attachment.
     * @return {String} The attachment of the post.
     * @author Stacey Popenfoose
     * @date 1/13/2022
     */
    getAttachment() {
        return String(this.attachment);
    }

    /**
     * Gets the document id of the post in the database as a string.
     * @return {String} The document id of the post.
     */
    getId() {
        return this._id;
    }

    /**
     * Gets the timestamp.
     * @return {String} The timestamp of the post.
     * @author Stacey Popenfoose
     * @date 1/13/2022
     */
    getTimestamp() {
        return String(this.timestamp); // capitalization?
    }

    /**
     * Gets the Responses array.
     * @return {String} The responses to the post.
     * @author Stacey Popenfoose
     * @date 1/13/2022
     */
    getResponses() {
        return String(this.response);
    }

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
     * @param {String} responseID The response to be deleted.
     * @return {Boolean} True if the response was deleted, false otherwise.
     *
     */
    deleteResponse() {}
}

module.exports = Post;
