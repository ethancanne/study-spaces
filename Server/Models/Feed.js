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
    studyGroup: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: Configuration.getStudyGroupCollectionName(),
        required: true
    }
});
FeedSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "feedId"
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
     * Initializes the post passed in from the database.
     * @param  {Mongoose.Schema} PostSchema The database record for a given post.
     * @author Cliff Croom
     * @date   01/11/2021
     */
    constructor(PostSchema) {
        // COPY THE DATABASE INSTANCE TO THE MODEL INSTANCE.
        // In order to maximize the usability of this class, the attributes stored in the database
        // record are copied to the instance of this class so they can be properly editied.
        // The feed schema is converted to a regular object to sanitize it of wrapper methods and properties.
        Object.assign(this, PostSchema.toObject());
    }

    /**
     * Adds a post to the feed.
     * @param {Post} post The post to add to the feed.
     * @return {Boolean} True if the post was added, false otherwise.
     *
     * @async
     */
    async addPost(post) {}

    /**
     * Creates a feed.
     * @author Cliff Croom
     * @return {Feed} The feed created.
     * @async
     * @static
     */
    static async create() {
        // CREATE FEED IN THE DATABASE.
        const BLANK = "BLANK";
        const EMPTY = [];
        const feedModel = new feedModel({
            posts: EMPTY
        });
        try {
            await feedModel.save();
        } catch (error) {
            console.log(error);
        }

        // RETURN THE CREATED INSTANCE.
        const feed = new Feed(feedModel);
        return feed;
    }

    /**
     * Deletes a feed.
     * @return {Boolean} True if the feed was deleted, false otherwise.
     * @author Cliff Croom
     * @async
     */
    async delete() {
        // DELETE THE FEED.
        let feedWasDeleted = false;
        let recordsDeleted = undefined;
        try {
            recordsDeleted = await FeedModel.deleteOne({ _id: this._id });
        } catch (error) {
            Log.writeError(error);
        } finally {
            feedWasDeleted = recordsDeleted.ok;
            return feedWasDeleted;
        }
    }

    /**
     * Deletes a post from the feed.
     * @param {Post} post The post to delete.
     * @return {Boolean} True if the post gets deleted, false otherwise.
     *
     * @async
     */
    async deletePost(post) {}

    /**
     * Gets the last three posts in the feed.
     * @return {Post[]} The last three posts from the feed.
     *
     * @async
     */
    async getLastThreePosts() {
        let threePosts = [this.posts[posts.length - 3], this.posts[posts.length - 2], this.posts[posts.length - 1]];
        return threePosts;
    }

    /**
     * Gets the most recent post in the feed.
     * @return {Post} The most recent post in the feed.
     *
     * @async
     */
    async getMostRecentPost() {
        return this.post;
    }

    /**
     * Gets the posts housed in a feed.
     * @return {Post[]} The posts in the feed.
     *
     * @async
     */
    async getPosts() {
        return this.posts;
    }
}

module.exports = Feed;
