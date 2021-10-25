const Filesystem = require("fs");

const Configuration = require("../Configuration.js");
const Validator = require("./Validator.js");

/**
* This class provides a unified interface for working with log files and console logs.
* @author Cameron Burkholder
* @date   07/29/2021
*/
class Log {
  /**
  * Determines if file logging is enabled.
  * @return {bool} True if file logging is enabled, false otherwise.
  * @author Cameron Burkholder
  * @date   07/29/2021
  */
  static fileLoggingIsEnabled() {
    return Configuration.fileLoggingIsEnabled();
  }

  /**
  * Handle the event where an error occurs while writing to a log file.
  * @param {error} error The error to handle.
  * @author Cameron Burkholder
  * @date 07/29/2021
  */
  static handleLogError(error) {
    let error_occurred = ("undefined" !== typeof error);
    if (error_occurred) {
      return Log.writeError(error);
    }
  }

  /**
  * Used to log server requests and routing. This is a middleware function
  * meant to be configured as an Express middleware.
  * @param {request} request The request to the server.
  * @param {response} response The server's response.
  * @param {function} nextMiddlewareFunction The next middleware function in the chain.
  * @author Cameron Burkholder
  * @date   10/22/2021
  */
  static logger(request, response, nextMiddlewareFunction) {
    // WRITE THE SERVER REQUEST TO THE LOG.
    const sourceIp = request.ip;
    const method = request.method;
    const route = `${request.protocol}://${request.hostname}${request.originalUrl}`;
    const responseStatus = response.statusCode;
    const browser = request.headers["user-agent"];
    const logLine = `${sourceIp} - "${method} ${route}" ${responseStatus} ${browser}`;
    Log.write(logLine);
    nextMiddlewareFunction();
  }

  /**
  * Clear the log.
  * @author Cameron Burkholder
  * @date   07/31/2021
  */
  static resetLog() {
    // IF FILE LOGGING IS ENABLED, RESET IT.
    const fileLoggingIsEnabled = Log.fileLoggingIsEnabled();
    if (fileLoggingIsEnabled) {
      const EMPTY_LOG_FILE = "";
      Filesystem.writeFile(Configuration.getLogFilepath(), EMPTY_LOG_FILE, Log.handleLogError);
    }
  }

  /**
  * Writes a message to the logs.
  * @param  {string} message The message to write.
  * @author Cameron Burkholder
  * @date   07/29/2021
  */
  static write(message) {
    // WRITE TO THE CONSOLE.
    console.log(message);

    // WRITE TO THE LOG FILE, IF FILE LOGGING IS ENABLED.
    const fileLoggingIsEnabled = Log.fileLoggingIsEnabled();
    if (fileLoggingIsEnabled) {
      Log.writeToFile(message);
    }
  }

  /**
  * Writes an error to the logs.
  * @param  {error} error The error to write.
  * @author Cameron Burkholder
  * @date   07/29/2021
  */
  static writeError(error) {
    // IF AN ERROR EXISTS TO BE LOGGED, LOG IT.
    const errorExists = Validator.isError(error);
    if (errorExists) {
      const errorAsString = error.toString();
      Log.writeToFile(errorAsString);
      console.log(error);
    }
  }

  /**
  * Writes a message to the log file.
  * @param  {string} message The message to write to the file.
  * @author Cameron Burkholder
  * @date   07/29/2021
  */
  static writeToFile(message) {
    // WRITE THE MESSAGE AND ENSURE THE NEW MESSAGE WILL BE ON A NEW LINE.
    const logFilepath = Configuration.getLogFilepath();
    const NEWLINE_MESSAGE = "\r\n";
    const timestamp = new Date().toString();
    Filesystem.appendFile(logFilepath, `${NEWLINE_MESSAGE}${timestamp}\t --- \t${message}`, Log.handleLogError);
  }
}

module.exports = Log;
