/**
 * Defines the response messages the server can send.
 * @author Cameron Burkholder
 * @date   10/05/2021
 */
const ResponseMessages = {
    Account: {
        ErrorCreateAccount: "An error occurred while attempting to create an account.",
        ErrorDeleteAccount: "An error occurred while attempting to delete an account.",
        NotOver18: "You need to be 18 or older to create an account.",
        IncorrectPassword: "The password provided is incorrect.",
        SuccessAccountCreated: "The account was created successfully.",
        SuccessAccountDeleted: "The account was deleted successfully",
        SuccessAccountSetup: "The account was setup successfully.",
        SuccessLogin: "The login was successful.",
        SuccessUpdateAuthenticationToken: "The authentication token has been successfully updated.",
        UnverifiedUserWasFound: "The unverified user was found.",
        UserAlreadyExists: "A user with that email address already exists.",
        UserNotFound: "The user was not found."
    },
    StudyGroup: {
        ErrorCreateStudyGroup: "An error ocurred while attempting to create a study group.",
        ErrorJoinStudyGroup: "An error occurred while attempting to join a study group.",
        SuccessStudyGroupCreated: "The study group was created sucessfully.",
        SuccessStudyGroupJoined: "The study group was joined successfully.",
        SuccessStudyGroupsRetrieved: "The study groups were retrieved sucessfully.",
        ErrorGettingSearchResults: "An error ocurred while attempting to get search results.",
        UserAlreadyJoined: "The study group cannot be joined again."
    }
};
module.exports = ResponseMessages;
