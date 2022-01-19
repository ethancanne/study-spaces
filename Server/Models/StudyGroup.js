const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const PrivacySettings = require("./PrivacySettings.js");
const Validator = require("../Validator.js");
const Feed = require("./Feed");

/**
 * Used to define the database schema for storing study groups.
 * @author Cliff Croom
 * @date   10/29/2021
 */
const StudyGroupSchema = new Schema({
    areaCode: {
        type: String,
        required: false
    },
    course: {
        type: String,
        required: false
    },
    feed: {
        type: String,
        required: true
    },
    isOnlineGroup: {
        type: Boolean,
        required: true
    },
    isTutorGroup: {
        type: Boolean,
        required: true
    },
    meetings: {
        type: [String],
        required: true
    },
    members: {
        type: [String],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    privacySetting: {
        type: String,
        required: true
    },
    recurringMeeting: {
        type: String,
        required: false
    },
    school: {
        type: String,
        required: false
    },
    subject: {
        type: String,
        required: true
    },
    groupColor: {
        type: String,
        required: true
    },
    feed: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: Configuration.getFeedCollectionName(),
        required: true
    }
});
StudyGroupSchema.set("toObject", {
    versionKey: false,
    transform: (document, object) => {
        delete object.__v;
        return object;
    }
});

const studyGroupCollectionName = Configuration.getStudyGroupCollectionName();
const StudyGroupModel = Mongoose.model(studyGroupCollectionName, StudyGroupSchema);

/**
 * Provides an interface for working with study groups in the database.
 * @property {String} areaCode The area code for the study group.
 * @property {String=} course The course the study group is associated with.
 * @property {String} feed The document ID for the study group's feed.
 * @property {Boolean} isOnlineGroup Indicates whether or not the study group is an online group.
 * @property {Boolean} isTutorGroup Indicates whether or not the study group is a tutor group.
 * @property {String[]} members The list of document IDs for members in the study group.
 * @property {String} name The name of the study group.
 * @property {Boolean} oneTimeMeetings The list of one-off meetings associated with the study group.
 * @property {String} owner The study group owner's document ID.
 * @property {Meeting=} recurringMeeting The study group's recurring meeting schedule.
 * @property {String=} school The school the study group is associated with.
 * @property {String} subject The subject the study group supports.
 * @author Cameron Burkholder
 * @date   10/29/2021
 */
class StudyGroup {
    /**
     * Initializes the study group to the group passed in from the database.
     * @param  {Mongoose.Schema} studyGroupSchema The database record for a given study group.
     * @author Cameron Burkholder
     * @date   10/29/2021
     */
    constructor(studyGroupSchema) {
        // COPY THE DATABASE INSTANCE TO THE MODEL INSTANCE.
        // In order to maximize the usability of this class, the attributes stored in the database
        // record are copied to the instance of this class so they can be properly editied.
        // The study group schema is converted to a regular object to sanitize it of wrapper methods and properties.
        Object.assign(this, studyGroupSchema.toObject());
    }

    /**
     * Adds a one-time meeting.
     * @param {Meeting} newMeeting The meeting to add.
     * @return {Boolean} True if the meeting was added, false otherwise.
     *
     * @async
     */
    async addMeeting(newMeeting) {}

    /**
     * Adds a member to the study group.
     * @param {User} newMember The member to add to the group.
     * @return {Boolean} True if the member was added, false otherwise.
     *
     * @async
     */
    async addMember(newMember) {}

    /**
     * Creates a study group.
     * @param {String} name The study group name.
     * @param {User} owner The owner of the study group.
     * @param {String} subject The study group's subject.
     * @return {StudyGroup} The created study group.
     * @author Clifton Croom and Ethan Cannelongo
     * @date   11/30/2021
     * @async
     * @static
     */
    static async create(name, owner, subject, areaCode, isOnlineGroup, isTutorGroup, course, school, groupColor) {
        // CREATE THE FEED ASSOCIATED WITH THE STUDY GROUP.
        const newFeed = await Feed.create();
        const newFeedId = Mongoose.Types.ObjectId(newFeed);

        // CREATE THE STUDY GROUP.
        const EMPTY_LIST_OF_MEETINGS = [];
        const EMPTY_LIST_OF_MEMBERS = [];
        const ownerId = owner.getId();
        const newStudyGroup = new StudyGroupModel({
            areaCode: areaCode,
            course: course,
            feed: newFeedId,
            isOnlineGroup: isOnlineGroup,
            isTutorGroup: isTutorGroup,
            meetings: EMPTY_LIST_OF_MEETINGS,
            members: EMPTY_LIST_OF_MEMBERS,
            name: name,
            owner: ownerId,
            privacySetting: PrivacySettings.Open,
            school: school,
            subject: subject,
            groupColor
        });

        // SAVE THE STUDY GROUP.
        try {
            await newStudyGroup.save();
        } catch (error) {
            Log.writeError(error);
        }

        // INSTANTIATE THE MODEL.
        const studyGroup = new StudyGroup(newStudyGroup);
        return studyGroup;
    }

    /**
     * Deletes a study group.
     * @return {Boolean} True if the study group was deleted, false otherwise.
     *
     * @async
     */
    async delete() {}

    /**
     * Gets the study group's area code.
     * @return {String} The study group's area code.
     */
    getAreaCode() {
        return this.areaCode;
    }

    /**
     * Gets the study group's course.
     * @return {String} The study group's associated course.
     *
     */
    getCourse() {
        return this.course;
    }

    /**
     * Gets the study group feed.
     * @return {Feed} The study group's feed.
     *
     * @async
     */
    async getFeed() {}

    /**
     * Gets the study group record from the database using the document ID.
     * @param  {String} studyGroupId The study group ID to search for.
     * @return {StudyGroup} The study group instance, if found; otherwise undefined.
     * @author Cliff Croom
     * @date   01/14/2022
     * @async
     * @static
     */
    static async getById(studyGroupId) {
        // CONVERT THE USER ID TO THE ACCEPTABLE TYPE.
        const convertedStudyGroupId = Mongoose.Types.ObjectId(studyGroupId);

        // GET THE USER BASED ON THE GIVEN ID.
        let studyGroupRecord = undefined;
        try {
            studyGroupRecord = await StudyGroupModel.findOne({ _id: convertedStudyGroupId }).exec();
        } catch (error) {
            Log.write("An error occurred while attempting to get a study group by ID.");
            Log.writeError(error);
            // If an error occurs, it should be returned.
            return error;
        } finally {
            // If the user wasn't able to be found in the database, this routine should return undefined.
            let studyGroup = undefined;
            let studyGroupWasFound = Validator.isDefined(studyGroupRecord);
            if (studyGroupWasFound) {
                // Since the userRecord is an instance of the UserSchema, it needs to be converted to an object.
                studyGroup = new StudyGroup(studyGroupRecord);
            }
            return studyGroup;
        }
    }

    /**
     * Gets the document id of the study group in the database as a string.
     * @return {String} The document id of the study group.
     */
    getId() {
        return this._id;
    }

    /**
     * Gets the study group's meetings.
     * @return {Meeting[]} The study group's meetings.
     *
     * @async
     */
    async getMeetings() {}

    /**
     * Gets the study group's members.
     * @return {User[]} The study group's members.
     *
     * @async
     */
    async getMembers() {}

    /**
     * Gets the study group's name.
     * @return {String} The study group's name.
     */
    getName() {
        return this.name;
    }

    /**
     * Gets the study group's upcoming meeting.
     * @return {Meeting} The very next study group meeting.
     *
     * @async
     */
    async getNextMeeting() {}

    /**
     * Gets the study group's one-time meetings.
     * @return {Meeting[]} The study group's one-time meetings.
     *
     * @async
     */
    async getOneTimeMeetings() {}

    /**
     * Gets the study group's owner.
     * @return {User} The study group's owner.
     *
     * @async
     */
    async getOwner() {}

    /**
     * Gets the study group's recurring meeting schedule.
     * @return {Meeting} The recurring meeting schedule.
     *
     * @async
     */
    async getRecurringMeeting() {}

    /**
     * Gets the study group's school.
     * @return {String} The study group's school.
     */
    getSchool() {
        return this.school;
    }

    /**
     * Gets the study group's subject.
     * @return {String} The study group's subject.
     */
    getSubject() {
        return this.subject;
    }

    /**
     * Checks if the group is an online group.
     * @return {Boolean} True if the group is an online group, false otherwise.
     */
    isOnlineGroup() {
        return this.isOnlineGroup;
    }

    /**
     * Checks if the group is a tutor group.
     * @return {Boolean} True if the group is a tutor group, false otherwise.
     */
    isTutorGroup() {
        return this.isTutorGroup;
    }

    /**
     * Sets the group to be an in-person group.
     * @return {Boolean} True if the group was set to be in-person, false otherwise.
     *
     * @async
     */
    async makeInPerson() {}

    /**
     * Sets the group to be an online group.
     * @return {Boolean} True if the group was set to be an online group, false otherwise.
     *
     * @async
     */
    async makeOnline() {}

    /**
     * Sets the group to be a regular study group.
     * @return {Boolean} True if the group was set to be a regular study group, false otherwise.
     *
     * @async
     */
    async makeStudyGroup() {}

    /**
     * Sets the group to be a tutor group.
     * @return {Boolean} True if the group was set to be a tutor group, false otherwise.
     *
     * @async
     */
    async makeTutorGroup() {}

    /**
     * Removes a meeting from the study group's one-time meeting schedule.
     * @param {Meeting} meeting The meeting to remove.
     * @return {Booleam} True if the meeting was removed, false otherwise.
     *
     * @async
     */
    async removeMeeting(meeting) {}

    /**
     * Removes a member from the study group.
     * @param {User} member The member to remove from the group.
     * @return {Boolean} True if the member was removed, false otherwise.
     *
     * @async
     */
    async removeMember(member) {}

    /**
     * This saves the associated user document in the database with the current properties
     * stored in this object.
     * @return {bool} True if the user was saved, false if the user wasn't saved.
     *
     * @async
     */
    async save() {}

    /**
     * Sets the study group's area code.
     * @param {String} areaCode The area code to set.
     * @return {Boolean} True if the area code was set, false otherwise.
     *
     * @async
     */
    async setAreaCode(areaCode) {}

    /**
     * Sets the study group's course.
     * @param {String} courseName The course to set.
     * @return {Boolean} True if the course was set, false otherwise.
     *
     * @async
     */
    async setCourse(courseName) {}

    /**
     * Sets the study group's name.
     * @param {String} name The name to set.
     * @return {Boolean} True if the name was set, false otherwise.
     *
     * @async
     */
    async setName(name) {}

    /**
     * Sets the study group's school.
     * @param {String} school The school to set.
     * @return {Boolean} True if the school was set, false otherwise.
     *
     * @async
     */
    async setSchool(school) {}

    /**
     * Sets the study group's subject.
     * @param {String} subject The subject to set.
     * @return {Boolean} True if the subject was set, false otherwise.
     *
     * @async
     */
    async setSubject(subject) {}

    /**
     * Updates the study group's meeting.
     * @param {Meeting} updatedMeeting The meeting to update.
     * @return {Boolean} True if the meeting was updated, false otherwise.
     *
     * @async
     */
    async updateMeeting(updatedMeeting) {}

    /**
     * Checks if the user is a member of the study group.
     * @param {User} user The user to check for study group membership.
     * @return {Boolean} True if the user is a member of the study group, false otherwise.
     *
     * @async
     */
    async userIsAMember(user) {}
}

module.exports = StudyGroup;
