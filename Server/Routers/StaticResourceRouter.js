const Path = require("path");

const Configuration = require("../../Configuration.js");
const Routes = require("../Routes/Routes.js");
const StaticResources = require("../Routes/StaticResources.js");

/**
* This defines the router used to serve static resources.
* @param {Server} server The server instance to use.
* @param {Authenticator} authenticator The authenticator to use.
* @author Cameron Burkholder
* @date   07/31/2021
*/
function StaticResourceRouter(server, authenticator) {
  // This serves the default index file, used to display all other contents of the application.
  server.get(Routes.StaticResources.Index, getIndexFile);
}

// GET ROUTES.
/**
* This serves the custom service worker.
* @param  {object} request The request being served.
* @param  {object} response The response being generated.
* @author Cameron Burkholder
* @date   07/31/2021
*/
function getIndexFile(request, response) {
  // SEND THE INDEX FILE.
  const staticResourceFolder = Configuration.getStaticResourceFolder();
  const indexFileFilepath = Path.join(global.rootDirectory, "Client", staticResourceFolder, StaticResources.Index);
  response.sendFile(indexFileFilepath);
}

module.exports = StaticResourceRouter;
