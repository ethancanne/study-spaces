/**
 * This defines the routes the server will serve.
 * @author Cameron Burkholder
 * @date   07/31/2021
 */
const Routes = {
    Account: {
        ChangeEmail: "/api/account/change-email",
        ChangePassword: "/api/account/change-password",
        CreateAccount: "/api/account/create",
        Delete: "/api/account/delete",
        GetUnverifiedUser: "/api/account/get-unverified-user",
        Login: "/api/account/login",
        SetupAccount: "/api/account/setup",
        UpdateAuthenticationToken: "/api/account/update-authentication-token",
        VerifyEmailChange: "/api/account/verify-email-change"
    },
    StaticResources: {
        Index: "/*"
    },
    Search: {
        GetSearchResults: "/api/search/get"
    },
    StudyGroup: {
        AddOneTimeMeeting: "/api/study-group/add-one-time-meeting",
        CreatePost: "/api/study-group/create-post",
        CreateStudyGroup: "/api/study-group/create",
        DeleteMeeting: "/api/study-group/delete-meeting",
        DeleteStudyGroup: "/api/study-group/delete",
        EditStudyGroup: "/api/study-group/edit-study-group",
        EditMeeting: "/api/study-group/edit-meeting",
        GetUserStudyGroups: "/api/study-group/get-all",
        GetStudyGroup: "/api/study-group/get",
        JoinStudyGroup: "/api/study-group/join",
        SetRecurringMeeting: "/api/study-group/set-recurring-meeting",
        LeaveStudyGroup: "/api/study-group/leave"
    }
};
module.exports = Routes;
