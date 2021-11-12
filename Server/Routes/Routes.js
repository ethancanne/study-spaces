/**
 * This defines the routes the server will serve.
 * @author Cameron Burkholder
 * @date   07/31/2021
 */
const Routes = {
  Account: {
    Login: "/api/account/login",
    UpdateAuthenticationToken: "/api/account/update-authentication-token",
    CreateAccount: "/api/account/create"
  },
  StaticResources: {
    Index: "/*"
  }
};
module.exports = Routes;
