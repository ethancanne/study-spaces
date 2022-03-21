const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const Validator = require("../Validator.js");
const Post = require("../Models/Post.js");

/**
 * Used to define the database schema for storing study group feeds.
 * @author Cameron Burkholder
 * @date   11/03/2021
 */
const FeedSchema = new Schema({
    //This needs to be done.
});

FeedSchema.virtual("posts", {
    ref: Configuration.getPostCollectionName(),
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
    constructor(FeedSchema) {
        // COPY THE DATABASE INSTANCE TO THE MODEL INSTANCE.
        // In order to maximize the usability of this class, the attributes stored in the database
        // record are copied to the instance of this class so they can be properly editied.
        // The feed schema is converted to a regular object to sanitize it of wrapper methods and properties.
        Object.assign(this, FeedSchema.toObject());
    }

    /**
     * Adds a post to the feed.
     * @param {Post} post The post to add to the feed.
     * @return {Boolean} True if the post was added, false otherwise.
     *
     * @async
     */
    async addPost(title, message, feedId, creator, type, attachment) {
        // CREATE THE POST
        let post = undefined;
        post = await Post.create(title, message, feedId, creator, type, attachment);
        const postWasAdded = Validator.isDefined(post);
        return postWasAdded;
    }

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
        const feedModel = new FeedModel({});
        try {
            await feedModel.save();
        } catch (error) {
            console.log(error);
        }

        // RETURN THE CREATED INSTANCE.
        const feed = new Feed(feedModel);
        return feedModel._id;
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
     * Gets the feed from its ID.
     * @param {Mongoose.Types.ObjectId} feedId The ID of the feed.
     */
    static async getById(feedId) {
        // CONVERT THE ID TO THE ACCEPTABLE TYPE.
        const convertedFeedId = Mongoose.Types.ObjectId(feedId);

        // GET THE USER BASED ON THE GIVEN ID.
        let feedRecord = undefined;
        try {
            feedRecord = await FeedModel.findOne({ _id: convertedFeedId }).exec();
        } catch (error) {
            Log.write("An error occurred while attempting to get a study group by ID.");
            Log.writeError(error);
            // If an error occurs, it should be returned.
            return error;
        } finally {
            // If the user wasn't able to be found in the database, this routine should return undefined.
            let feed = undefined;
            let feedWasFound = Validator.isDefined(feedRecord);
            if (feedWasFound) {
                // Since the userRecord is an instance of the UserSchema, it needs to be converted to an object.
                feed = new Feed(feedRecord);
            }
            return feed;
        }
    }

    /**
     * Gets the document id of the feed in the database as a string.
     * @return {Mongoose.Types.ObjectId} The document id of the feed.
     * @author Clifton Croom
     * @date   03/07/2022
     */
    getId() {
        return this._id;
    }

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
     * @author Cameron Burkholder
     * @date   03/07/2022
     * @async
     */
    async getPosts() {
        // CONVERT THE ID TO THE ACCEPTABLE TYPE.
        const feedId = this._id;

        // GET THE USER BASED ON THE GIVEN ID.
        let feedRecord = undefined;
        try {
            feedRecord = await FeedModel.findOne({ _id: feedId }).exec();
        } catch (error) {
            Log.write("An error occurred while attempting to get a feed by ID.");
            Log.writeError(error);
            // If an error occurs, it should be returned.
            return error;
        } finally {
            await feedRecord.populate("posts");
            let postIndex = 0;
            let postCount = feedRecord.posts.length;
            while (postIndex < postCount) {
                await feedRecord.posts[postIndex].populate("creator");
                postIndex++;
            }
            const posts = feedRecord.posts;
            return posts;
        }
    }
}

module.exports = Feed;
