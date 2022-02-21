const Path = require("path");

const Authenticator = require("../Authenticator.js");
const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const { Meeting } = require("../Models/Meeting.js");
const PrivacySettings = require("../Models/PrivacySettings.js");
const ResponseCodes = require("../Responses/ResponseCodes.js");
const ResponseMessages = require("../Responses/ResponseMessages.js");
const Routes = require("../Routes/Routes.js");
const StaticResources = require("../Routes/StaticResources.js");
const StudyGroup = require("../Models/StudyGroup.js");
const Validator = require("../Validator.js");
const User = require("../Models/User.js");

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
     * @static
     */
    static serveRoutes(server, authenticator) {
        // Used to add one-time meetings.
        server.post(Routes.StudyGroup.AddOneTimeMeeting,
            authenticator.protectRoute(),
            StudyGroupRouter.addOneTimeMeeting);
        // This is used to create study groups.
        server.post(
            Routes.StudyGroup.CreateStudyGroup,
            authenticator.protectRoute(),
            Validator.validateCreateStudyGroupInput,
            StudyGroupRouter.createStudyGroup
        );
        // Used to delete a study group.
        server.delete(
            Routes.StudyGroup.DeleteStudyGroup,
            authenticator.protectRoute(),
            StudyGroupRouter.deleteStudyGroup
        );
        // This is used to edit a study group.
        server.post(Routes.StudyGroup.EditStudyGroup, authenticator.protectRoute(), StudyGroupRouter.editStudyGroup);
        // This is used to get a specific study group.
        server.get(Routes.StudyGroup.GetStudyGroup, authenticator.protectRoute(), StudyGroupRouter.getStudyGroup);
        // This is used to get a user's study groups.
        server.get(
            Routes.StudyGroup.GetUserStudyGroups,
            authenticator.protectRoute(),
            StudyGroupRouter.getUserStudyGroups
        );
        // This is used to join a study group.
        server.post(Routes.StudyGroup.JoinStudyGroup, authenticator.protectRoute(), StudyGroupRouter.joinStudyGroup);
        // Used to set recurring meetings.
        server.post(
            Routes.StudyGroup.SetRecurringMeeting,
            authenticator.protectRoute(),
            StudyGroupRouter.setRecurringMeeting
        );
    }

    /**
     * Allows the study group owner to add a one-time meeting.
     * @param {String} request.body.date The date the meeting occurs.
     * @param {String} request.body.studyGroupId The group ID.
     * @param {String} request.body.time The time the meeting occurs.
     * @param {String=} request.body.day The day of the meeting.
     * @param {String=} request.body.details Information about the meeting.
     * @param {String=} request.body.location The location of the meeting.
     * @param {String=} request.body.roomNumber The room number of the meeting location.
     * @author Cameron Burkholder
     * @date   02/21/2022
     * @async
     * @static
     */
    static async addOneTimeMeeting(request, response) {
        // CHECK THAT THE USER IS THE OWNER OF THE STUDY GROUP.
        const user = request.user;
        const studyGroupId = request.body.studyGroupId;
        let studyGroup = await StudyGroup.getById(studyGroupId);
        // Check that the study group exists.
        const studyGroupWasFound = Validator.isDefined(studyGroup);
        if (!studyGroupWasFound) {
            return reponse.json({ message: ResponseMessages.StudyGroup.UserNotOwner });
        }

        // CHECK IF THE USER IS THE OWNER OF THE STUDY GROUP.
        const userIsOwner = studyGroup.userIsOwner(user);
        if (!userIsOwner) {
            return response.json({ message: ResponseMessages.StudyGroup.UserNotOwner });
        }

        // CREATE THE ONE-TIME MEETING.
        const { day, frequency, time, date, details, location, roomNumber } = request.body;
        const oneTimeMeeting = await Meeting.createOneTime(date, time, day, details, location, roomNumber);

        // ADD THE ONE-TIME MEETING.
        let oneTimeMeetingWasSet = await studyGroup.addMeeting(oneTimeMeeting);
        if (oneTimeMeetingWasSet) {
            return response.json({ message: ResponseMessages.StudyGroup.AddOneTimeMeeting.Success });
        } else {
            return response.json({ message: ResponseMessages.StudyGroup.AddOneTimeMeeting.Error });
        }
    }

    /**
     * @param {String} request.body.name The name of the study group being created.
     * @param {String} request.body.subject The subject of the study group being created.
     * @param {String} request.body.areaCode The area code of the study group being created.
     * @param {String} request.body.inOnlineGroup True if the group is online, false otherwise.
     * @param {String} request.body.isTutorGroup True if the group is a tutor group, false otherwise.
     * @param {String} request.body.course The course of the study group being created.
     * @param {String} request.user The user creating the study group.
     * @author Clifton Croom
     * @date   11/30/21
     * @async
     * @static
     */
    static async createStudyGroup(request, response) {
        // CREATE STUDY GROUP.
        let newStudyGroup = undefined;
        try {
            newStudyGroup = await StudyGroup.create(
                request.body.name,
                request.user,
                request.body.subject,
                request.body.areaCode,
                request.body.isOnlineGroup,
                request.body.isTutorGroup,
                request.body.course,
                request.body.school,
                request.body.groupColor,
                request.body.description
            );
        } catch (error) {
            Log.writeError(error);
        }
        const studyGroupWasNotCreated = Validator.isUndefined(newStudyGroup);

        // VALIDATE STUDY GROUP CREATION.
        if (studyGroupWasNotCreated) {
            return response.json({ message: ResponseMessages.StudyGroup.ErrorCreateStudyGroup });
        }

        // ADD THE STUDY GROUP TO THE USER.
        let studyGroupWasAdded = false;
        try {
            studyGroupWasAdded = await request.user.addStudyGroup(newStudyGroup);
        } catch (error) {
            Log.writeError(error);
        }
        if (!studyGroupWasAdded) {
            return response.json({ message: ResponseMessages.StudyGroup.ErrorCreateStudyGroup });
        }

        // SEND SUCCESS MESSAGE
        response.json({
            message: ResponseMessages.StudyGroup.SuccessStudyGroupCreated,
            newStudyGroup: newStudyGroup
        });
    }

    /**
     * Deletes a study group.
     * @param {String} request.body.studyGroupId
     * @author Cameron Burkholder
     * @date   02/12/2022
     * @async
     * @static
     */
    static async deleteStudyGroup(request, response) {
        // GET THE STUDY GROUP.
        const studyGroupId = request.body.studyGroupId;
        let studyGroup = undefined;
        try {
            studyGroup = await StudyGroup.getById(studyGroupId);
        } catch (error) {
            Log.write("An error occurred while attempting to get the study group.");
            Log.writeError(error);
            response.status(ResponseCodes.Error);
            return response.json({ message: ResponseMessages.StudyGroup.ErrorDeleteStudyGroup });
        }
        const studyGroupWasNotFound = Validator.isUndefined(studyGroup);
        if (studyGroupWasNotFound) {
            return response.json({ message: ResponseMessages.StudyGroup.StudyGroupNotFound });
        }

        // CHECK THAT THE REQUESTING USER IS AN OWNER OF THE STUDY GROUP.
        const userIsOwner = studyGroup.userIsOwner(request.user);
        if (!userIsOwner) {
            response.status(ResponseCodes.Unauthorized);
            return response.json({ message: ResponseMessages.StudyGroup.UserNotOwner });
        }

        // DELETE THE STUDY GROUP.
        let studyGroupDeleted = false;
        try {
            studyGroupDeleted = await studyGroup.delete();
        } catch (error) {
            Log.write("An error occurred while attempting to delete the study group.");
            Log.writeError(error);
            response.status(ResponseCodes.Error);
            return response.json({ message: ResponseMessages.StudyGroup.ErrorDeleteStudyGroup });
        }
        if (!studyGroupDeleted) {
            response.status(ResponseCodes.Error);
            return response.json({ message: ResponseMessages.StudyGroup.ErrorDeleteStudyGroup });
        }
        return response.json({ message: ResponseMessages.StudyGroup.SuccessStudyGroupDeleted });
    }

    /**
     * A route to edit one or more details of a study group.
     * @param {String} request.body.course
     * @param {String} request.body.description
     * @param {String} request.body.groupColor
     * @param {Boolean} request.body.isOnlineGroup
     * @param {Boolean} request.body.isTutorGroup
     * @param {String} request.body.name
     * @param {String} request.body.subject
     * @param {Object} request.body.studyGroupId
     * @author Clifton Croom
     * @date 02/16/2022
     * @async
     * @static
     */
    static async editStudyGroup(request, response) {

        //GET ORIGINAL STUDY GROUP
        const studyGroupId = request.body.studyGroupId;
        let studyGroup = undefined;
        console.log(request.body.studyGroupId);
        try {
            studyGroup = await StudyGroup.getById(studyGroupId);
        } catch (error) {
            Log.write("An error occurred while attempting to get the study group.");
            Log.writeError(error);
            response.status(ResponseCodes.Error);
            return response.json({ message: ResponseMessages.StudyGroup.ErrorGetStudyGroup });
        }

        const studyGroupWasNotFound = Validator.isUndefined(studyGroup);
        if (studyGroupWasNotFound) {
            return response.json({ message: ResponseMessages.StudyGroup.StudyGroupNotFound });
        }

        console.log(studyGroup.getCourse())
        // CHECK FOR EDITS AND MAKE CHANGES IF NECESSARY

        //Check for new study group course
        if(request.body.course != studyGroup.getCourse()) {
            studyGroup.setCourse(request.body.course);
        }
        console.log(studyGroup.getCourse())

        //Check for new study group description
        if(request.body.description != studyGroup.getDescription()) {
            studyGroup.setDescription(request.body.description);
        }

        //Check for new color
        if(request.body.groupColor != studyGroup.getGroupColor()) {
            studyGroup.setGroupColor(request.body.groupColor);
        }


        //Check for change in study group mode
        if(request.body.isOnlineGroup != studyGroup.OnlineGroup()) {
            if(studyGroup.OnlineGroup()){
                studyGroup.makeInPerson();
            }
            else {
                studyGroup.makeOnline();
            }
        }

        //Check for change in study group type
        if(request.body.isTutorGroup != studyGroup.getIsTutorGroup()) {
            if(studyGroup.getIsTutorGroup()) {
                studyGroup.makeStudyGroup();
            } else {
                studyGroup.makeTutorGroup();
            }
        }

        //Check for change in study group name
        if(request.body.name != studyGroup.getName()) {
            if(request.body.name == null) {
                return response.json({message: ResponseMessages.StudyGroup.ErrorNullStudyGroupInput})
            }
            studyGroup.setName(request.body.name);
        }

        //Check for change in study group subject
        if(request.body.subject != studyGroup.getSubject()) {
            if(request.body.subject == null) {
                return response.json({message: ResponseMessages.StudyGroup.ErrorNullStudyGroupInput})
            }
            studyGroup.setSubject(request.body.subject);
        }

        //RETURN SUCCESS MESSAGE
        return response.json({
            message: ResponseMessages.StudyGroup.SuccessStudyGroupEdited,
            studyGroup: studyGroup
        });



    }


    /**
     * Gets the study group with a given study group ID.
     * @param {String} request.query.studyGroupId The study group ID.
     * @author Cameron Burkholder
     * @date   02/12/2022
     * @async
     * @static
     */
    static async getStudyGroup(request, response) {
        // GET THE STUDY GROUP.
        const studyGroupId = request.query.studyGroupId;
        let studyGroup = undefined;
        try {
            studyGroup = await StudyGroup.getById(studyGroupId);
        } catch (error) {
            Log.write("An error occurred while attempting to get the study group.");
            Log.writeError(error);
            response.status(ResponseCodes.Error);
            return response.json({ message: ResponseMessages.StudyGroup.ErrorGetStudyGroup });
        }
        const studyGroupWasNotFound = Validator.isUndefined(studyGroup);
        if (studyGroupWasNotFound) {
            return response.json({ message: ResponseMessages.StudyGroup.StudyGroupNotFound });
        }

        // CHECK THAT THE REQUESTING USER IS ON THE STUDY GROUP.
        const userIsAMember = studyGroup.userIsAMember(request.user);
        if (!userIsAMember) {
            response.status(ResponseCodes.Unauthorized);
            return response.json({ message: ResponseMessages.StudyGroup.UserNotInStudyGroup });
        }

        // CHECK THAT THE STUDY GROUP IS ACTIVE.
        const studyGroupIsActive = studyGroup.isActive();
        if (!studyGroupIsActive) {
            return response.json({ message: ResponseMessages.StudyGroup.StudyGroupIsNotActive });
        }

        // POPULATE THE STUDY GROUP'S OWNER.
        let ownerWasFound = await studyGroup.getOwner();
        if (!ownerWasFound) {
            response.status(ResponseCodes.Error);
            return response.json({ message: ResponseMessages.StudyGroup.ErrorGetStudyGroup });
        }

        // POPULATE THE STUDY GROUP'S MEMBERS.
        let membersWereFound = false;
        membersWereFound = await studyGroup.getMembers();
        if (!membersWereFound) {
            response.status(ResponseCodes.Error);
            return response.json({ message: ResponseMessages.StudyGroup.ErrorGetStudyGroup });
        }

        // POPULATE THE STUDY GROUP'S FEED.
        let feedWasPopulated = false;
        feedWasPopulated = await studyGroup.getFeed();
        if (!feedWasPopulated) {
            response.status(ResponseCodes.Error);
            return response.json({ message: ResponseMessages.StudyGroup.ErrorGetStudyGroup });
        }

        // RETURN THE STUDY GROUP.
        return response.json({
            message: ResponseMessages.StudyGroup.SuccessStudyGroupRetrieved,
            studyGroup: studyGroup
        });
    }

    /**
     * Gets the study groups a user has joined.
     * @param
     * @author Ethan Cannelongo
     * @date   01/14/2022
     * @async
     * @static
     */
    static async getUserStudyGroups(request, response) {
        // CREATE STUDY GROUP.
        let studyGroups = undefined;
        try {
            studyGroups = await request.user.getStudyGroups();
        } catch (error) {
            Log.writeError(error);
        } finally {
            // SEND SUCCESS MESSAGE.
            if (Validator.isDefined(studyGroups)) {
                response.json({
                    message: ResponseMessages.StudyGroup.SuccessStudyGroupsRetrieved,
                    studyGroups: studyGroups
                });
            } else {
                response.json({ message: ResponseMessages.StudyGroup.ErrorCreateStudyGroup });
            }
        }
    }

    /**
     * Allows a user to join a study group.
     * @author Cameron Burkholder
     * @date   02/03/2022
     * @async
     * @static
     */
    static async joinStudyGroup(request, response) {
        // GET THE USER JOINING THE GROUP.
        const user = request.user;

        // GET THE STUDY GROUP BEING JOINED.
        let studyGroup = undefined;
        try {
            studyGroup = await StudyGroup.getById(request.body.studyGroupId);
        } catch (error) {
            Log.write("An error occurred while attempting to join a study group.");
            Log.writeError(error);
            response.status(ResponseCodes.Error);
        }
        const studyGroupWasNotFound = Validator.isUndefined(studyGroup);
        if (studyGroupWasNotFound) {
            return response.json({ message: ResponseMessages.StudyGroup.ErrorJoinStudyGroup });
        }

        // CHECK IF THE USER IS ALREADY IN THE STUDY GROUP.
        const userAlreadyJoinedStudyGroup = studyGroup.userIsAMember(user);
        if (userAlreadyJoinedStudyGroup) {
            return response.json({ message: ResponseMessages.StudyGroup.UserAlreadyJoined });
        }

        // CHECK IF THE USER IS THE OWNER OF THE STUDY GROUP.
        const userIsOwnerOfStudyGroup = String(request.user.getId()) === String(studyGroup.owner);
        if (userIsOwnerOfStudyGroup) {
            return response.json({ message: ResponseMessages.StudyGroup.UserAlreadyJoined });
        }

        // CHECK IF THE USER IS ASSOCIATED WITH THE SAME SCHOOL AS THE STUDY GROUP
        const userIsNotAssociatedWithSameSchool =
            request.user.getSchool() !== studyGroup.school && studyGroup.school !== "";
        if (userIsNotAssociatedWithSameSchool) {
            return response.json({ message: ResponseMessages.StudyGroup.UserNotAssociatedWithSchoolOfStudyGroup });
        }

        // CHECK IF THE STUDY GROUP HAS ITS PRIVACY SETTING SET TO OPEN OR PRIVATE.
        // Since we elected to make the private study group an optional feature,
        // checking this is merely done to provide flexibility for future teams.
        const studyGroupIsOpen = PrivacySettings.Open === studyGroup.privacySetting;
        if (studyGroupIsOpen) {
            // ADD THE USER TO THE STUDY GROUP.
            // Since the membership of a study group is identified in two places,
            // the user will need to be added to the study group's member list as
            // well as adding the study group to the user's study group list.
            let userWasAddedToStudyGroup = false;
            try {
                userWasAddedToStudyGroup = await studyGroup.addMember(user);
            } catch (error) {
                Log.write("An error occurred while attempting to add a user to a study group.");
                Log.writeError(error);
                response.status(ResponseCodes.Error);
            }
            if (!userWasAddedToStudyGroup) {
                return response.json({ message: ResponseMessages.StudyGroup.ErrorJoinStudyGroup });
            }

            // ADD THE STUDY GROUP TO THE USER.
            let studyGroupWasAddedToUser = false;
            try {
                studyGroupWasAddedToUser = await user.addStudyGroup(studyGroup);
            } catch (error) {
                Log.write("An error ocurred while attempting to add a study group to a user.");
                Log.writeError(error);
                response.status(ResponseCodes.Error);
            }
            if (!studyGroupWasAddedToUser) {
                return response.json({ message: ResponseMessages.StudyGroup.ErrorJoinStudyGroup });
            }
        } else {
            // Nothing needs done here in this iteration of the project.
        }

        // SEND THE RESPONSE.
        // If execution reaches this point then the user has successfully been added to the study group.
        return response.json({ message: ResponseMessages.StudyGroup.SuccessStudyGroupJoined });
    }

    /**
     * Allows the study group owner to set a recurring meeting.
     * @param {String} request.body.day The day of the meeting.
     * @param {String} request.body.frequency How often the meeting occurs.
     * @param {String} request.body.studyGroupId The group ID.
     * @param {String} request.body.time The time the meeting occurs.
     * @param {String=} request.body.date The date the meeting occurs.
     * @param {String=} request.body.details Information about the meeting.
     * @param {String=} request.body.location The location of the meeting.
     * @param {String=} request.body.roomNumber The room number of the meeting location.
     * @author Cameron Burkholder
     * @date   02/18/2022
     * @async
     * @static
     */
    static async setRecurringMeeting(request, response) {
        // CHECK THAT THE USER IS THE OWNER OF THE STUDY GROUP.
        const user = request.user;
        const studyGroupId = request.body.studyGroupId;
        let studyGroup = await StudyGroup.getById(studyGroupId);
        // Check that the study group exists.
        const studyGroupWasFound = Validator.isDefined(studyGroup);
        if (!studyGroupWasFound) {
            return reponse.json({ message: ResponseMessages.StudyGroup.UserNotOwner });
        }

        // CHECK IF THE USER IS THE OWNER OF THE STUDY GROUP.
        const userIsOwner = studyGroup.userIsOwner(user);
        if (!userIsOwner) {
            return response.json({ message: ResponseMessages.StudyGroup.UserNotOwner });
        }

        // GET THE RECURRING MEETING.
        // If the study group already has a recurring meeting set,
        // that one should be changed to reflect the new data.
        // If there isn't a recurring meeting already, one should be created.
        const recurringMeetingExists = Validator.isDefined(studyGroup.recurringMeeting);
        const { day, frequency, time, date, details, location, roomNumber } = request.body;
        if (recurringMeetingExists) {
            // GET THE RECURRING MEETING.
            const recurringMeeting = await Meeting.getById(studyGroup.recurringMeeting);

            // SET THE RECURRING MEETING ATTRIBUTES.
            let meetingUpdated = true;
            meetingUpdated = meetingUpdated && (await recurringMeeting.setDay(day));
            meetingUpdated = meetingUpdated && (await recurringMeeting.setFrequency(frequency));
            meetingUpdated = meetingUpdated && (await recurringMeeting.setTime(time));
            meetingUpdated = meetingUpdated && (await recurringMeeting.setDate(date));
            meetingUpdated = meetingUpdated && (await recurringMeeting.setDetails(details));
            meetingUpdated = meetingUpdated && (await recurringMeeting.setLocation(location));
            meetingUpdated = meetingUpdated && (await recurringMeeting.setRoomNumber(roomNumber));
            if (meetingUpdated) {
                return response.json({ message: ResponseMessages.StudyGroup.SetRecurringMeeting.Success });
            } else {
                return response.json({ message: ResponseMessages.StudyGroup.SetRecurringMeeting.Error });
            }
        } else {
            // CREATE THE MEETING.
            const recurringMeeting = await Meeting.create(day, frequency, time, date, details, location, roomNumber);

            // SET THE RECURRING MEETING.
            const meetingId = recurringMeeting.getId();
            let recurringMeetingWasSet = await studyGroup.setRecurringMeeting(meetingId);
            if (!recurringMeetingWasSet) {
                return response.json({ message: ResponseMessages.StudyGroup.SetRecurringMeeting.Error });
            } else {
                return response.json({ message: ResponseMessages.StudyGroup.SetRecurringMeeting.Success });
            }
        }
    }
}
module.exports = StudyGroupRouter;
