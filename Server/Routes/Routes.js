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
  Study: {
    CreateStudyGroup: "api/study/create"
  },
  StaticResources: {
    Index: "/*"
  },
  StudyGroup: {
    CreateStudyGroup: "/api/study-group/create"
  }
};
module.exports = Routes;
