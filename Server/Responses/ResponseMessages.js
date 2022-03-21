/**
 * Defines the response messages the server can send.
 * @author Cameron Burkholder
 * @date   10/05/2021
 */
const ResponseMessages = {
    Account: {
        ErrorChangingEmail: "An error occurred while attempting to change the email.",
        ErrorChangingPassword: "An error occurred while attempting to change the password.",
        ErrorCreateAccount: "An error occurred while attempting to create an account.",
        ErrorDeleteAccount: "An error occurred while attempting to delete an account.",
        ErrorInvalidPasswordInput: "The passwords provided were invalid.",
        ErrorSendingEmail: "There was an error sending your verification email.",
        ErrorSettingToken: "There was an error setting the verification token",
        ErrorUploadProfilePicture: "The file type selected is not supported.",
        EmailSent: "Verification email sent.",
        NotOver18: "You need to be 18 or older to create an account.",
        InvalidEmail: "The email address entered is not valid.",
        IncorrectPassword: "The password provided is incorrect.",
        InvalidAccountInput: "One or more fields have been left empty.",
        SuccessAccountCreated: "The account was created successfully.",
        SuccessAccountDeleted: "The account was deleted successfully",
        SuccessAccountSetup: "The account was setup successfully.",
        SuccessChangingEmail: "The email was changed successfully",
        SuccessChangingPassword: "The password was changed successfully",
        SuccessLogin: "The login was successful.",
        SuccessUpdateAuthenticationToken: "The authentication token has been successfully updated.",
        UnverifiedUserWasFound: "The unverified user was found.",
        UserAlreadyExists: "A user with that email address already exists.",
        UserNotFound: "The user was not found.",
        PasswordsMustMatch: "The passwords entered must match.",
        PasswordTooShort: "The password must be at least 6 characters.",
        InactiveAccount: "The account requested is not active."
    },
    Message: {
        ErrorAddConversation: "An error occurrred while attempting to add a conversation. ",
        ErrorConversationExists: "The conversation requested already exists.",
        ErrorGetConversation: "An error occurred while attempting to get the conversation.",
        ErrorGetReceiver: "An error occurred while attempting to get the receiver.",
        ErrorCreateConversation: "An error occurred while attempting to create the conversation.",
        GetConversations: {
            Error: "An error occurred while attempting to get all conversations for a user.",
            Success: "All conversations were found for a user."
        },
        SuccessGetConversation: "Conversation returned successfully.",
        SuccessCreateConversation: "Conversation created successfully."
    },
    StudyGroup: {
        AddOneTimeMeeting: {
            Error: "An error occured while attempting to add a one-time meeting.",
            InvalidInput: "One or more required fields is empty.",
            Success: "The one-time meeting was added successfully."
        },
        CreatePost: {
            Error: "An error occurred while attempting to create a post.",
            InvalidAttachment: "The file attached is of an unsupported format.",
            InvalidInput: "One or more required fields is empty.",
            Success: "The post was created successfully."
        },
        ErrorCreateStudyGroup: "An error occurred while attempting to create a study group.",
        ErrorDeleteStudyGroup: "An error occurred while attempting to delete a study group.",
        ErrorDeleteMeeting: "An error occurred while attempting to delete a meeting.",
        ErrorEditMeeting: "An error occurred while attempting to edit the meeting.",
        ErrorGetStudyGroup: "An error occurred while attempting to get a study group.",
        ErrorLeaveStudyGroup: "The study group you are trying to leave was not found.",
        ErrorJoinStudyGroup: "An error occurred while attempting to join a study group.",
        ErrorRemoveUser: "There was an error removing user from the study group.",
        ErrorRemoveStudyGroup: "There was an error removing study group from the user.",
        InvalidEditStudyGroup: "One or more required fields is empty.",
        StudyGroupIsNotActive: "The requested study group is not active.",
        MeetingNotFound: "The requested meeting was not found.",
        StudyGroupNotFound: "The requested study group was not found.",
        SuccessDeleteMeeting: "The meeting was deleted successfully.",
        SuccessStudyGroupCreated: "The study group was created sucessfully.",
        SuccessStudyGroupDeleted: "The study group was deleted successfully.",
        SuccessStudyGroupEdited: "The study group was edited successfully",
        SuccessStudyGroupJoined: "The study group was joined successfully.",
        SuccessStudyGroupLeft: "The study group was left successfully.",
        SuccessStudyGroupRetrieved: "The study group was retrieved successfully.",
        SuccessStudyGroupsRetrieved: "The study groups were retrieved sucessfully.",
        ErrorGettingSearchResults: "An error ocurred while attempting to get search results.",
        UserAlreadyJoined: "The study group cannot be joined again.",
        UserNotAssociatedWithSchoolOfStudyGroup:
            "The study group cannot be joined because you are not a part of this school.",
        UserNotInStudyGroup: "The requesting user is not a member of the study group.",
        UserNotOwner: "The requesting user is not the owner of the study group.",
        ErrorNullStudyGroupInput: "Error: Empty input was received for either the study group name or the user.",
        SetRecurringMeeting: {
            Error: "An error occurred while attempting to set the recurring meeting.",
            InvalidInput: "One or more required fields is empty.",
            Success: "The recurring meeting was set successfully."
        }
    }
};
module.exports = ResponseMessages;
