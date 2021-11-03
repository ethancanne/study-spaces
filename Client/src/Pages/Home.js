import React, { useState } from "react"

import Page from "./Page.js"
import Views from "../views/Views.js"

// IMPORT VIEWS FOR THIS PAGE.
import LoginView from "../views/Home/LoginView.js"

/**
 * The home page of the application. This is shown when the user has not logged in.
 * @param {function} clientSideLogin The function used to log in a user from the client-side perspective.
 * @param {function} clientSideLogout The function used to log out a user from the client-side perspective.
 * @author Cameron Burkholder and Ethan Cannelongo
 * @date   10/20/2021
 */
const Home = (props) => {
  const [view, setHomeView] = useState(Views.Home.Login);

  let homeView = <></>;
  switch (view) {
    case Views.Home.Login:
      homeView = <LoginView
        clientSideLogin={props.clientSideLogin}
        clientSideLogout={props.clientSideLogout}/>;
      break;
  }

  return (
    <Page>
      { homeView }
    </Page>
  );
}

export default Home;
