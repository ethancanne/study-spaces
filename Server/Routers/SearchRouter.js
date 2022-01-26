const Path = require("path");

const Authenticator = require("../Authenticator.js");
const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const ResponseCodes = require("../Responses/ResponseCodes.js");
const ResponseMessages = require("../Responses/ResponseMessages.js");
const Routes = require("../Routes/Routes.js");
const StaticResources = require("../Routes/StaticResources.js");
const StudyGroup = require("../Models/StudyGroup.js");
const Validator = require("../Validator.js");

/**
 * The router used to serve search-related requests.
 * @param
 * @author Clifton Croom
 * @date   11/17/2021
 */
 class SearchRouter {
        static serveRoutes(server, authenticator) {
            server.get(
                Routes.Search.GetSearchResults,
                authenticator.protectRoute(),
                SearchRouter.getSearchResults
            );
        }
        /**
         * Gets the search results from the study group search.
         *
         * @author Clifton Croom
         * @date   01/25/2022
         * @async
         * @static
         */
        static async getSearchResults(request, response) {

        // Empty variable for array of study groups.
        let studyGroups = undefined;

        // Try and catch errors while requesting study groups.
        try {
            studyGroups = await request.StudyGroup.search(request.body.filters);
        }
        catch (error) {
            Log.writeError(error);
        }
        finally {
            // Send success message and array of studyGroups.
            if (Validator.isDefined(studyGroups)) {
                response.json({
                    message: ResponseMessages.StudyGroup.SuccessStudyGroupsRetrieved,
                    studyGroups: studyGroups
                });
            // Send error message.
            } else {
                response.json({ message: ResponseMessages.StudyGroup.ErrorGettingSearchResults });
            }
        }
    }
 }
module.exports = SearchRouter;
