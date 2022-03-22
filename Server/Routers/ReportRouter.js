const Authenticator = require("../Authenticator.js");
const Configuration = require("../../Configuration.js");
const Conversation = require("../Models/Conversation.js");
const Events = require("../Events.js");
const ResponseMessages = require("../Responses/ResponseMessages.js");
const Routes = require("../Routes/Routes.js");
const Validator = require("../Validator.js");
const User = require("../Models/User.js");
const Log = require("../Log.js");
const StudyGroup = require("../Models/StudyGroup.js");

/**
 * The router used to serve reports
 * @author Clifton Croom
 * @date 03/22/22
 */

class ReportRouter {

    /**
     * Initialize the router and serve the routes.
     * @param {Server} server The server instance used to provide the routes.
     * @param {Authenticator} authenticator The authenticator used to protect the routes.
     * @author Clifton Croom
     * @date   03/22/2022
     */
    static serveRoutes(server, authenticator) {
        // Used to send a report.
        server.post(Routes.Report.SendReport, authenticator.protectRoute(), ReportRouter.sendReport);
    }

    /**
     * Send report via email. Report types include users, study group owners, tutors, study groups and posts.
     * @param {String} request.body.id The ID of the item being reported
     * @param {String} request.body.comment The comment associated with the report.
     * @param {String} request.body.reportType The type of the report being sent.
     * @author Clifton Croom
     * @date   03/22/22
     * @async
     * @static
     */

    static async sendReport(request, response) {
        //SEND REPORT

        //Format Email Subject and Body
        let emailSubject = request.body.reportType;
        let emailBody = "Report from: " + request.user.getName()
        + " User ID: " + request.user.getId() + " Item Identifier: " + 
        request.body.id +  " Comment: " + request.body.comment;
        
        
       //Send Email
        let emailWasSent = false;
        try {
            emailWasSent = await Authenticator.sendReportEmail(emailSubject, emailBody);
        } catch (error) {
            Log.write("An error occurred while sending an email during the account creation process.");
            Log.writeError(error);
        }
        if (!emailWasSent) {
            return response.json({ message: ResponseMessages.Account.ErrorSendingEmail });
        } else {
            return response.json({ message: ResponseMessages.Report.EmailSent});
        }

    }
}

module.exports = ReportRouter;