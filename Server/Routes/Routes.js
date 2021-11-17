/**
 * This defines the routes the server will serve.
 * @author Cameron Burkholder
 * @date   07/31/2021
 */
const Routes = {
  Account: {
    CreateAccount: "/api/account/create",
    SetupAccount: "/api/account/setup",
    Login: "/api/account/login",
    SetupAccount: "/api/account/setup",
    UpdateAuthenticationToken: "/api/account/update-authentication-token",
    GetUnverifiedUser: "/api/account/get-unverified-user"
  },
  StaticResources: {
    Index: "/*"
  }
};
module.exports = Routes;
