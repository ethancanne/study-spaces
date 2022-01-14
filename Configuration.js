// LOAD ENVIRONMENT VARIABLES.
const Path = require("path");
require("dotenv").config();

/**
 * This class provides an interface for configuration settings set
 * through environment variables.
 * @author Cameron Burkholder
 * @date   07/29/2021
 */
class Configuration {
    /**
     * Determines if file logging is enabled.
     * @return {boolean} True if file logging is enabled, false otherwise.
     * @author Cameron Burkholder
     * @date   10/20/2021
     * @static
     */
    static fileLoggingIsEnabled() {
        return process.env.FILE_LOGGING_IS_ENABLED;
    }

    /**
     * Gets the name of the collection used to store conversations.
     * @return {String} The name of the collection used to store conversations.
     * @author Cameron Burkholder
     * @date   10/29/2021
     * @static
     */
    static getConversationCollectionName() {
        return process.env.COLLECTION_FOR_CONVERSATIONS;
    }

    /**
     * Gets the database URI to use. The URI to use might differ depending
     * on if the application is in development or production, so there are
     * possibly two correct URIs depending on the context.
     * @return {String} The database URI to use.
     * @author Cameron Burkholder
     * @date   07/29/2021
     * @static
     */
    static getDatabaseUri() {
        const applicationIsInProduction = Configuration.isSetToProduction();
        let databaseUri = "";
        if (applicationIsInProduction) {
            databaseUri = this.getProductionDatabaseUri();
        } else {
            databaseUri = this.getDevelopmentDatabaseUri();
        }
        return databaseUri;
    }

    /**
     * Gets the development database URI.
     * @return {String} The development database URI.
     * @author Cameron Burkholder
     * @date   07/29/2021
     * @static
     */
    static getDevelopmentDatabaseUri() {
        return process.env.DEVELOPMENT_DATABASE_URI;
    }

    /**
     * Gets the name of the collection used to store study group feeds.
     * @return {String} The name of the collection used to store study group feeds.
     * @author Cameron Burkholder
     * @date   11/03/2021
     * @static
     */
    static getFeedCollectionName() {
        return process.env.COLLECTION_FOR_FEEDS;
    }

    /**
     * Gets the name of the collection used to store locations.
     * @return {String} The name of the collection used to store locations.
     * @author Cameron Burkholder
     * @date   11/03/2021
     */
    static getLocationCollectionName() {
        return process.env.COLLECTION_FOR_LOCATIONS;
    }

    /**
     * Gets the log file file name for the server logs.
     * @return {String} The log file name.
     * @author Cameron Burkholder
     * @date   07/29/2021
     * @static
     */
    static getLogFileName() {
        return process.env.LOG_FILE_NAME;
    }

    /**
     * Gets the log folder name for server logs.
     * @return {String} The log folder name.
     * @author Cameron Burkholder
     * @date   11/09/2021
     * @static
     */
    static getLogFolderName() {
        return process.env.LOG_FOLDER_NAME;
    }

    /**
     * Gets the name of the collection used to store study group meetings.
     * @return {String} The name of the collection used to store study group meetings.
     * @author Cameron Burkholder
     * @date   11/03/2021
     * @static
     */
    static getMeetingCollectionName() {
        return process.env.COLLECTION_FOR_MEETINGS;
    }

    /**
     * Gets the name of the collection used to store messages.
     * @return {String} The name of the collection used to store messages.
     * @author Cameron Burkholder
     * @date   10/29/2021
     * @static
     */
    static getMessageCollectionName() {
        return process.env.COLLECTION_FOR_MESSAGES;
    }

    /**
     * Gets the node environment. This determines whether the application
     * is in production mode or development mode.
     * @return {String} The node environment.
     * @author Cameron Burkholder
     * @date   10/20/2021
     * @static
     */
    static getNodeEnvironment() {
        return process.env.NODE_ENV;
    }

    /**
     * Gets the name of the collection used to store posts.
     * @return {String} The name of the collection used to store posts.
     * @author Cameron Burkholder
     * @date   11/03/2021
     * @static
     */
    static getPostCollectionName() {
        return process.env.COLLECTION_FOR_POSTS;
    }

    /**
     * Gets the private RSA key. This is used for authentiction token encryption.
     * @return {String} The private RSA key.
     * @author Cameron Burkholder
     * @date   10/20/2021
     * @static
     */
    static getPrivateRsaKey() {
        // The RSA key needs newline escape characters replaced with actual new lines.
        return process.env.RSA_PRIVATE_KEY.replace(/\\n/g, "\n");
    }

    /**
     * Gets the production database URI.
     * @return {String} The production database URI.
     * @author Cameron Burkholder
     * @date   07/29/2021
     * @static
     */
    static getProductionDatabaseUri() {
        return process.env.PRODUCTION_DATABASE_URI;
    }

    /**
     * Gets the public RSA key. This is used for authentication token encryption.
     * @return {String} The public RSA key.
     * @author Cameron Burkholder
     * @date   07/29/2021
     * @static
     */
    static getPublicRsaKey() {
        // The RSA key needs newline escape characters replaced with actual new lines.
        return process.env.RSA_PUBLIC_KEY.replace(/\\n/g, "\n");
    }

    /**
     * Gets the server port to use.
     * @return {String} The server port.
     * @author Cameron Burkholder
     * @date   07/31/2021
     * @static
     */
    static getServerPort() {
        // The default port used in most applications is 5000. In the event that the
        // application is being hosted on a remote server, the port assigned to the
        // process running the application might be different, so that one should be used.
        const DEFAULT_PORT = 5000;
        return process.env.PORT || DEFAULT_PORT;
    }

    /**
     * Gets the filepath of the folder for the static resource build to serve.
     * @return {String} The filepath of the folder to serve the static resource build from.
     * @author Cameron Burkholder
     * @date   07/29/2021
     * @static
     */
    static getStaticResourceFolder() {
        return process.env.STATIC_RESOURCE_FOLDER;
    }

    /**
     * Gets the name of the collection used to store study groups.
     * @return {String} The name of the collection used to store study groups.
     * @author Cameron Burkholder
     * @date   10/29/2021
     * @static
     */
    static getStudyGroupCollectionName() {
        return process.env.COLLECTION_FOR_STUDY_GROUPS;
    }

    /**
     * Gets the name of the collection used to store users.
     * @return {String} The name of the collection used to store unverified users.
     * @author Cameron Burkholder
     * @date   10/29/2021
     * @static
     */
    static getUnverifiedUserCollectionName() {
        return process.env.COLLECTION_FOR_UNVERIFIED_USERS;
    }

    /**
     * Gets the name of the collection used to store users.
     * @return {String} The name of the collection used to store users.
     * @author Cameron Burkholder
     * @date   07/29/2021
     * @static
     */
    static getUserCollectionName() {
        return process.env.COLLECTION_FOR_USERS;
    }

    /**
     * Determines whether the application is in development or production mode.
     * @return {bool} True if the application is in production mode; false otherwise.
     * @author Cameron Burkholder
     * @date   07/29/2021
     * @static
     */
    static isSetToProduction() {
        const productionStatusName = "production";
        let applicationIsInProduction = process.env.NODE_ENV === productionStatusName;
        return applicationIsInProduction;
    }
}

module.exports = Configuration;
