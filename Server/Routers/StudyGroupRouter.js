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
 * The router used to serve account-related requests.
 * @author Clifton Croom
 * @date   11/17/2021
 */
class StudyGroupRouter {
    /**
     * Initialize the router and serve the routes.
     * @param {Server} server The server instance used to provide the routes.
     * @param {Authenticator} authenticator The authenticator used to protect the routes.
     * @author Clifton Croom
     * @date   11/17/2021
     */
    static serveRoutes(server, authenticator) {
        // This is used to create study groups.
        server.post(Routes.StudyGroup.CreateStudyGroup, StudyGroupRouter.createStudyGroup);
    }

    /**
     * @param {string} request.body.name The name of the study group being created.
     * @param {string} request.body.owner The name of the study group being created. 
     * @param {string} request.body.subject The name of the study group being created. 
     * @param {string} request.body.areaCode The name of the study group being created. 
     * @param {string} request.body.inOnlineGroup The name of the study group being created. 
     * @param {string} request.body.isTutorGroup The name of the study group being created. 
     * @param {string} request.body.course The name of the study group being created. 
     * @param {string} request.body.school The name of the study group being created.
     * @author Clifton Croom
     * @date 11/30/21 
     */
    static async createStudyGroup(request, response) {
        // CREATE STUDY GROUP.
        const newStudyGroup = await StudyGroup.create(request.body.name, request.body.owner, request.body.subject, request.body.areaCode, request.body.isOnlineGroup, request.body.isTutorGroup, request.body.course, request.body.school);
        const studyGroupWasNotCreated = Validator.isUndefined(newStudyGroup);

        // VALIDATE STUDY GROUP CREATION
        if (studyGroupWasNotCreated) {
            return response.json({ message: ResponseMessages.StudyGroup.ErrorCreateStudyGroup });
        }

        // SEND SUCCESS MESSAGE
        response.json({
            message: ResponseMessages.StudyGroup.SuccessStudyGroupCreated,
            newStudyGroup: newStudyGroup
        });
    }
}
module.exports = StudyGroupRouter;
