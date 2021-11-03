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
  */
  static fileLoggingIsEnabled() {
    return process.env.FILE_LOGGING_IS_ENABLED;
  }

  /**
  * Gets the name of the collection used to store conversations.
  * @return {String} The name of the collection used to store conversations.
  * @author Cameron Burkholder
  * @date   10/29/2021
  */
  static getConversationCollectionName() {
    // GET THE CONVERSATION COLLECTION NAME.
    return process.env.COLLECTION_FOR_CONVERSATIONS;
  }

  /**
  * Gets the database URI to use. The URI to use might differ depending
  * on if the application is in development or production, so there are
  * possibly two correct URIs depending on the context.
  * @return {string} The database URI to use.
  * @author Cameron Burkholder
  * @date   07/29/2021
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
  * @return {string} The development database URI.
  * @author Cameron Burkholder
  * @date   07/29/2021
  */
  static getDevelopmentDatabaseUri() {
    return process.env.DEVELOPMENT_DATABASE_URI;
  }

  /**
  * Gets the name of the collection used to store study group feeds.
  * @return {String} The name of the collection used to store study group feeds.
  * @author Cameron Burkholder
  * @date   11/03/2021
  */
  static getFeedCollectionName() {
    // GET THE STUDY GROUP FEED COLLECTION NAME.
    return process.env.COLLECTION_FOR_FEEDS;
  }

  /**
  * Gets the name of the collection used to store locations.
  * @return {String} The name of the collection used to store locations.
  * @author Cameron Burkholder
  * @date   11/03/2021
  */
  static getLocationCollectionName() {
    // GET THE LOCATION COLLECTION NAME.
    return process.env.COLLECTION_FOR_LOCATION;
  }

  /**
  * Gets the log file filepath for the server logs.
  * @return {string} The log file filepath.
  * @author Cameron Burkholder
  * @date   07/29/2021
  */
  static getLogFilepath() {
    return process.env.LOG_FILEPATH;
  }

  /**
  * Gets the name of the collection used to store study group meetings.
  * @return {String} The name of the collection used to store study group meetings.
  * @author Cameron Burkholder
  * @date   11/03/2021
  */
  static getMeetingCollectionName() {
    // GET THE MEETING COLLECTION NAME.
    return process.env.COLLECTION_FOR_MEETINGS;
  }

  /**
  * Gets the name of the collection used to store messages.
  * @return {String} The name of the collection used to store messages.
  * @author Cameron Burkholder
  * @date   10/29/2021
  */
  static getMessageCollectionName() {
    // GET THE MESSAGE COLLECTION NAME.
    return process.env.COLLECTION_FOR_MESSAGES;
  }

  /**
  * Gets the node environment. This determines whether the application
  * is in production mode or development mode.
  * @return {string} The node environment.
  * @author Cameron Burkholder
  * @date   10/20/2021
  */
  static getNodeEnvironment() {
    return process.env.NODE_ENV;
  }

  /**
  * Gets the name of the collection used to store posts.
  * @return {String} The name of the collection used to store posts.
  * @author Cameron Burkholder
  * @date   11/03/2021
  */
  static getPostCollectionName() {
    // GET THE POSTS COLLECTION NAME.
    return process.env.COLLECTION_FOR_POSTS;
  }

  /**
  * Gets the private RSA key. This is used for authentiction token encryption.
  * @return {string} The private RSA key.
  * @author Cameron Burkholder
  * @date   10/20/2021
  */
  static getPrivateRsaKey() {
    // EXPLICITLY WRITE NEWLINE CHARACTERS.
    return process.env.RSA_PRIVATE_KEY.replace(/\\n/g, "\n");
  }

  /**
  * Gets the production database URI.
  * @return {string} The production database URI.
  * @author Cameron Burkholder
  * @date   07/29/2021
  */
  static getProductionDatabaseUri() {
    return process.env.PRODUCTION_DATABASE_URI;
  }

  /**
  * Gets the public RSA key. This is used for authentication token encryption.
  * @return {string} The public RSA key.
  * @author Cameron Burkholder
  * @date   07/29/2021
  */
  static getPublicRsaKey() {
    // EXPLICITLY WRITE NEWLINE CHARACTERS.
    return process.env.RSA_PUBLIC_KEY.replace(/\\n/g, "\n")
  }

  /**
  * Gets the server port to use.
  * @return {string} The server port.
  * @author Cameron Burkholder
  * @date   07/31/2021
  */
  static getServerPort() {
    // GET THE SERVER PORT.
    const DEFAULT_PORT = 5000;
    return (process.env.PORT | DEFAULT_PORT);
  }

  /**
  * Gets the filepath of the folder for the static resource build to serve.
  * @return {string} The filepath of the folder to serve the static resource build from.
  * @author Cameron Burkholder
  * @date   07/29/2021
  */
  static getStaticResourceFolder() {
    // GET THE STATIC RESOURCE FOLDER TO USE.
    return process.env.STATIC_RESOURCE_FOLDER;
  }

  /**
  * Gets the name of the collection used to store study groups.
  * @return {String} The name of the collection used to store study groups.
  * @author Cameron Burkholder
  * @date   10/29/2021
  */
  static getStudyGroupCollectionName() {
    // GET THE STUDY GROUP COLLECTION NAME.
    return process.env.COLLECTION_FOR_STUDY_GROUPS;
  }

  /**
  * Gets the name of the collection used to store users.
  * @return {String} The name of the collection used to store unverified users.
  * @author Cameron Burkholder
  * @date   10/29/2021
  */
  static getUnverifiedUserCollectionName() {
    // GET THE UNVERIFIED USER COLLECTION NAME.
    return process.env.COLLECTION_FOR_UNVERIFIED_USERS;
  }

  /**
  * Gets the name of the collection used to store users.
  * @return {string} The name of the collection used to store users.
  * @author Cameron Burkholder
  * @date   07/29/2021
  */
  static getUserCollectionName() {
    // GET THE USER COLLECTION NAME.
    return process.env.COLLECTION_FOR_USERS;
  }

  /**
  * Determines whether the application is in development or production mode.
  * @return {bool} True if the application is in production mode; false otherwise.
  * @author Cameron Burkholder
  * @date   07/29/2021
  */
  static isSetToProduction() {
    // DETERMINE IF THE CURRENT CONFIGURATION MODE IS PRODUCTION.
    const productionStatusName = "production";
    let applicationIsInProduction = (process.env.NODE_ENV === productionStatusName);
    return applicationIsInProduction;
  }
}

module.exports = Configuration;
