/*
* This file is the main entry point for running the application. This file initiates the web server.
* @author Cameron Burkholder
* @date   07/29/2021
*/

const BodyParser = require("body-parser");
const Express = require("express");
const Helmet = require("helmet");
const Mongoose = require("mongoose");
const Morgan = require("morgan");
const Passport = require("passport");
const Path = require("path");

const Authenticator = require("./Authenticator.js");
const Configuration = require("./Configuration.js");
const Log = require("./Log.js");
const NotificationsRouter = require("./Routers/NotificationsRouter.js");
const StaticResourceRouter = require("./Routers/StaticResourceRouter.js");

// ASSIGN THE ROOT DIRECTORY TO A GLOBAL VARIABLE FOR REUSE THROUGHOUT THE APPLICATION.
const rootDirectory = Path.resolve(__dirname);
global.rootDirectory = rootDirectory;

// SETUP EXPRESS.
const server = Express();
const staticResourceFolder = Configuration.getStaticResourceFolder();
const staticResourceFilepath = Path.join(global.rootDirectory, "Client", staticResourceFolder);
server.use(Express.static(staticResourceFilepath));
server.use(BodyParser.urlencoded({ extended: false }));
server.use(BodyParser.json());
const configurationIsSetToProduction = Configuration.isSetToProduction();
// If the application is in production mode, use Morgan logging.
if (configurationIsSetToProduction) {
  server.use(Morgan("combined"));
}

// RESET LOGGING.
Log.resetLog();
const fileLoggingIsEnabled = Configuration.fileLoggingIsEnabled();
if (fileLoggingIsEnabled) {
  Log.write("Logging started with file logging enabled.");
} else {
  Log.write("Logging started.");
}

// SETUP DATABASE CONNECTION.
const databaseUri = Configuration.getDatabaseUri();
// Handle an error that occurs while establishing database connection.
try {
  Mongoose.connect(databaseUri, { useNewUrlParser: true, useUnifiedTopology: true });
  Log.write("Connection to database established.");
} catch(error) {
  Log.write("An error occurred while connecting to the database.");
  Log.writeError(error);
}
// Handle an error that occurs after the database connection has been established.
Mongoose.connection.on("error", (error) => {
  Log.write("An error occurred after the database connection was established.");
  Log.writeError(error);
});

// SETUP AUTHENTICATION.
server.use(Passport.initialize());
const authenticator = new Authenticator(server, Passport);

// ADD SECURITY MIDDLEWARE.
server.use(Helmet());

// IMPLEMENT THE SERVER ROUTES.
NotificationsRouter(server, authenticator);
// The static resource router needs to go last so that it is used for routes not addressed above.
StaticResourceRouter(server, authenticator);

// START SERVER.
const serverPort = Configuration.getServerPort();
server.listen(serverPort, () => {
  Log.write(`Server deployed on port ${serverPort}.`);
});
