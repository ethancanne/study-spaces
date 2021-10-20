// LOAD ENVIRONMENT VARIABLES.
const Path = require("path");
require("dotenv").config();

/**
* This class provides a wrapper to interface with the environment variables.
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
  * Gets the database URI to use.
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
  * Gets the log file filepath.
  * @return {string} The log file filepath.
  * @author Cameron Burkholder
  * @date   07/29/2021
  */
  static getLogFilepath() {
    return process.env.LOG_FILEPATH;
  }

  /**
  * Gets the node environment.
  * @return {string} The node environment.
  * @author Cameron Burkholder
  * @date   10/20/2021
  */
  static getNodeEnvironment() {
    return process.env.NODE_ENV;
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
  * Gets the public RSA key.
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
