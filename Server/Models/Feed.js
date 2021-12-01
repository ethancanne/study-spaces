const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const Validator = require("../Validator.js");

/**
 * Used to define the database schema for storing study group feeds.
 * @author Cameron Burkholder
 * @date   11/03/2021
 */
const FeedSchema = new Schema({
    lastUpdated: {
        type: Date,
        required: true
    },
    posts: {
        type: [String],
        required: true
    }
});
FeedSchema.set("toObject", {
    versionKey: false,
    transform: (document, object) => {
        delete object.__v;
        return object;
    }
});
const feedCollectionName = Configuration.getFeedCollectionName();
const FeedModel = Mongoose.model(feedCollectionName, FeedSchema);

/**
 * Provides an interface for working with a study group's feeds in the database.
 * @property {Date} lastUpdated The time when the feed was last updated. This is used to
 *   track updates to the feed.
 * @property {String[]} posts A list of posts associated with the study group's feed.
 * @author Cameron Burkholder
 * @date   11/04/2021
 */
class Feed {
    /**
     * Adds a post to the feed.
     * @param {Post} post The post to add to the feed.
     */
    async addPost(post) {}

    /**
     * Creates a feed.
     * @return {Feed} The feed created.
     */
    static async create() {}

    /**
     * Deletes a feed.
     * @return {Boolean} True if the feed was deleted, false otherwise.
     */
    async delete() {}

    /**
     * Deletes a post from the feed.
     * @param {Post} post The post to delete.
     * @return {Boolean} True if the post gets deleted, fales otherwise.
     */
    async deletePost(post) {}

    /**
     * Gets the last three posts in the feed.
     * @return {Post[]} The last three posts from the feed.
     */
    async getLastThreePosts() {}

    /**
     * Gets the most recent post in the feed.
     * @return {Post} The most recent post in the feed.
     */
    async getMostRecentPost() {}

    /**
     * Gets the posts housed in a feed.
     * @return {Post[]} The posts in the feed.
     */
    async getPosts() {}
}

module.exports = Feed;
