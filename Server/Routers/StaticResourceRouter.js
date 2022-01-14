const Path = require("path");

const Configuration = require("../../Configuration.js");
const Routes = require("../Routes/Routes.js");
const StaticResources = require("../Routes/StaticResources.js");

/**
 * The router used to serve static resources.
 * @author Cameron Burkholder
 * @date   10/20/2021
 */
class StaticResourceRouter {
    /**
     * Initialize the router and serve the routes.
     * @param {Server} server The server instance used to provide the routes.
     * @param {Authenticator} authenticator The authenticator used to protect the routes.
     * @author Cameron Burkholder
     * @date   10/20/2021
     */
    static serveRoutes(server, authenticator) {
        // This serves the default index file, used to display all other contents of the application.
        server.get(Routes.StaticResources.Index, StaticResourceRouter.getIndexFile);
    }

    // GET ROUTES.
    /**
     * This serves the index file.
     * @param  {object} request The request being served.
     * @param  {object} response The response being generated.
     * @author Cameron Burkholder
     * @date   07/31/2021
     * @static
     */
    static getIndexFile(request, response) {
        // SEND THE INDEX FILE.
        const staticResourceFolder = Configuration.getStaticResourceFolder();
        const indexFileFilepath = Path.join(
            global.rootDirectory,
            "Client",
            staticResourceFolder,
            StaticResources.Index
        );
        response.sendFile(indexFileFilepath);
    }
}

module.exports = StaticResourceRouter;
