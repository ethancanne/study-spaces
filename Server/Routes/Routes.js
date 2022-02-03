/**
 * This defines the routes the server will serve.
 * @author Cameron Burkholder
 * @date   07/31/2021
 */
const Routes = {
    Account: {
        CreateAccount: "/api/account/create",
        GetUnverifiedUser: "/api/account/get-unverified-user",
        Login: "/api/account/login",
        SetupAccount: "/api/account/setup",
        UpdateAuthenticationToken: "/api/account/update-authentication-token"
    },
    StaticResources: {
        Index: "/*"
    },
    Search: {
        GetSearchResults: "/api/search/get"
    },
    StudyGroup: {
        CreateStudyGroup: "/api/study-group/create",
        GetUserStudyGroups: "/api/study-group/get",
        JoinStudyGroup: "/api/study-group/join"
    }
};
module.exports = Routes;
