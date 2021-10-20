/**
* This defines the routes the server will serve.
* @author Cameron Burkholder
* @date   07/31/2021
*/
const Routes = {
  Notifications: {
    Subscribe: "/api/notifications/subscribe"
  },
  StaticResources: {
    CustomServiceWorker: "/custom-service-worker.js",
    DefaultServiceWorker: "/service-worker.js",
    Index: "/*"
  }
};
module.exports = Routes;
