const Authenticator = require("../Authenticator.js");
const PrivacySettings = require("../Models/PrivacySettings.js");
const ResponseCodes = require("../Responses/ResponseCodes.js");
const ResponseMessages = require("../Responses/ResponseMessages.js");
const Routes = require("../Routes/Routes.js");
const StudyGroup = require("../Models/StudyGroup.js");
const Validator = require("../Validator.js");


/**
 * The router used to serve account-related requests.
 * @author Clifton Croom
 * @date   11/17/2021
 */
 class MessageRouter {

    /**
     * Initialize the router and serve the routes.
     * @param {Server} server The server instance used to provide the routes.
     * @param {Authenticator} authenticator The authenticator used to protect the routes.
     * @author Clifton Croom
     * @date   03/09/2022
     * @static
     */
    static serveRoutes(server, authenticator) {

        // This is used to get a conversation
        server.post(
            Routes.Message.GetConversation,
            authenticator.protectRoute(),
            MessageRouter.getConversation
        );

    }

        /**
        * Gets the conversation of two users.
        * @param 
        * @author Clifton Croom
        * @date   03/09/2022
        * @async
        * @static
        */
        static async getConversation(request, response) {
            let conversation = undefined;
            try {
                conversation = await request.user.getConversation(request.user.getId(), request.body.person);
            } catch (error) {
                log.writeError(error);
            }   finally {
                
                if (Validator.isDefined(conversation)) {
                    response.json({
                        message: ResponseMessages.Message.SuccessGetConversation,
                        conversation: conversation
                    });
                } else {
                    response.json({ message: ResponseMessages.Message.ErrorGetConversation });
                }
            }
        }
        
 }


 module.exports = MessageRouter;
