const BodyParser = require("body-parser");
const Express = require("express");
const Helmet = require("helmet");
const Mongoose = require("mongoose");
const Passport = require("passport");
const Path = require("path");

const Authenticator = require("./Authenticator.js");
const Configuration = require("../Configuration.js");
const Log = require("./Log.js");
const AccountRouter = require("./Routers/AccountRouter.js");
const SearchRouter = require("./Routers/SearchRouter.js");
const StaticResourceRouter = require("./Routers/StaticResourceRouter.js");
const StudyGroupRouter = require("./Routers/StudyGroupRouter.js");

// ASSIGN THE ROOT DIRECTORY TO A GLOBAL VARIABLE FOR REUSE THROUGHOUT THE APPLICATION.
const rootDirectory = Path.resolve("./");
global.rootDirectory = rootDirectory;

// SETUP EXPRESS.
// Express is used to implement middleware.
const server = Express();
const staticResourceFolder = Configuration.getStaticResourceFolder();
const staticResourceFilepath = Path.join(global.rootDirectory, "Client", staticResourceFolder);
server.use(Express.static(staticResourceFilepath));
server.use(BodyParser.urlencoded({ limit: "200mb", extended: false }));
server.use(BodyParser.json({ limit: "200mb" }));
const configurationIsSetToProduction = Configuration.isSetToProduction();

// ENABLE LOGGING.
// Before logging is enabled, the log file is reset to ensure a clean log.
Log.resetLog();
const fileLoggingIsEnabled = Configuration.fileLoggingIsEnabled();
if (fileLoggingIsEnabled) {
    Log.write("Logging started with file logging enabled.");
} else {
    Log.write("Logging started.");
}
server.use(Log.logger);

// SETUP DATABASE CONNECTION.
const databaseUri = Configuration.getDatabaseUri();
// Handle an error that occurs while establishing database connection.
try {
    Mongoose.connect(databaseUri, { useNewUrlParser: true, useUnifiedTopology: true });
    Log.write("Connection to database established.");
} catch (error) {
    Log.write("An error occurred while connecting to the database.");
    Log.writeError(error);
}
// Handle an error that occurs after the database connection has been established.
Mongoose.connection.on("error", (error) => {
    Log.write("An error occurred after the database connection was established.");
    Log.writeError(error);
});

// SETUP AUTHENTICATION.
// The authenticator object is used to protect routes
// and manage authentication tokens.
server.use(Passport.initialize());
const authenticator = new Authenticator(server, Passport);

// ADD SECURITY MIDDLEWARE.
// Helmet is used to help with basic security.
server.use(Helmet());

//Make uploads path accessable
server.use("/uploads", Express.static("uploads"));

// IMPLEMENT THE SERVER ROUTES.
AccountRouter.serveRoutes(server, authenticator);
StudyGroupRouter.serveRoutes(server, authenticator);
SearchRouter.serveRoutes(server, authenticator);
// The static resource router needs to go last so that it is used for routes not addressed above.
StaticResourceRouter.serveRoutes(server, authenticator);

// START SERVER.
const serverPort = Configuration.getServerPort();
server.listen(serverPort, () => {
    Log.write(`Server deployed on port ${serverPort} in mode: ${Configuration.getNodeEnvironment()}.`);
});
