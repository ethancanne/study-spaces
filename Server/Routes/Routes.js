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
        CreateStudyGroup: "/api/study-group/create",
        DeleteStudyGroup: "/api/study-group/delete",
        EditStudyGroup: "/api/study-group/edit-study-group",
        GetUserStudyGroups: "/api/study-group/get-all",
        GetStudyGroup: "/api/study-group/get",
        JoinStudyGroup: "/api/study-group/join"
    }
};
module.exports = Routes;
