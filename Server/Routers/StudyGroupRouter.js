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
    *
    */
    static async createStudyGroup(request, response) {

        // CHECK FOR AN EXISTING STUDY GROUP.
        const existingStudyGroup = await StudyGroup.getById(request.body.studyGroupId);
        const existingStudyGroupAlreadyExists = Validator.isDefined(existingStudyGroup);
        if (existingStudyGroupAlreadyExists) {
            return response.json({ message: ResponseMessages.StudyGroup.StudyGroupAlreadyExists });
        }

        // CREATE STUDY GROUP
        const newStudyGroup = await StudyGroup.create(request.body.name, request.body.owner, request.body.subject)
        const studyGroupWasNotCreated = Validator.isUndefined(newStudyGroup);
        if (studyGroupWasNotCreated) {
            return response.json({ message: ResponseMessages.StudyGroup.ErrorCreateStudyGroup });
        }

        response.json({
            message: ResponseMessages.StudyGroup.SuccessStudyGroupCreated,
            newStudyGroup: newStudyGroup
          });

    }
}
module.exports = StudyGroupRouter;
