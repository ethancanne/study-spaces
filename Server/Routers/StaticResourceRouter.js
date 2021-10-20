const Path = require("path");

const Configuration = require("../Configuration.js");
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
  // This serves the custom service worker, used to support push notifications.
  server.get(Routes.StaticResources.CustomServiceWorker, getCustomServiceWorker);
  // This serves the default service worker.
  server.get(Routes.StaticResources.DefaultServiceWorker, getDefaultServiceWorker);
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
function getCustomServiceWorker(request, response) {
  // SEND THE CUSTOM SERVICE WORKER.
  const customServiceWorkerFilepath = Path.join(global.rootDirectory, "client", "build", StaticResources.CustomServiceWorker);
  response.sendFile(customServiceWorkerFilepath);
}

/**
* This serves the default service worker.
* @param  {object} request The request being served.
* @param  {object} response The response being generated.
* @author Cameron Burkholder
* @date   07/31/2021
*/
function getDefaultServiceWorker(request, response) {
  // SEND THE DEFAULT SERVICE WORKER.
  const defaultServiceWorkerFilepath = Path.join(global.rootDirectory, "client", "build", StaticResources.DefaultServiceWorker);
  response.sendFile(defaultServiceWorkerFilepath);
}

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
  const indexFileFilepath = Path.join(global.rootDirectory, "client", staticResourceFolder, StaticResources.Index);
  response.sendFile(indexFileFilepath);
}

module.exports = StaticResourceRouter;
