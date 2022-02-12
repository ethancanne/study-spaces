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
        EmailSent: "Verification email sent.",
        NotOver18: "You need to be 18 or older to create an account.",
        IncorrectPassword: "The password provided is incorrect.",
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
        InactiveAccount: "The account requested is not active."
    },
    StudyGroup: {
        ErrorCreateStudyGroup: "An error ocurred while attempting to create a study group.",
        ErrorDeleteStudyGroup: "An error occurred while attempting to delete a study group.",
        ErrorGetStudyGroup: "An error occurred while attempting to get a study group.",
        ErrorJoinStudyGroup: "An error occurred while attempting to join a study group.",
        StudyGroupIsNotActive: "The requested study group is not active.",
        StudyGroupNotFound: "The requested study group was not found.",
        SuccessStudyGroupCreated: "The study group was created sucessfully.",
        SuccessStudyGroupDeleted: "The study group was deleted successfully",
        SuccessStudyGroupJoined: "The study group was joined successfully.",
        SuccessStudyGroupRetrieved: "The study group was retrieved successfully.",
        SuccessStudyGroupsRetrieved: "The study groups were retrieved sucessfully.",
        ErrorGettingSearchResults: "An error ocurred while attempting to get search results.",
        UserAlreadyJoined: "The study group cannot be joined again.",
        UserNotInStudyGroup: "The requesting user is not a member of the study group.",
        UserNotOwner: "The requesting user is not the owner of the study group.",
        ErrorNullStudyGroupInput: "Error: Empty input was received for either the study group name or the user."
    }
};
module.exports = ResponseMessages;
