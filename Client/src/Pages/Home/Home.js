import React, { useState } from "react";

import "./Home.scss";

import Page from "../Page.js";
import Views from "../../views/Views.js";

// IMPORT VIEWS FOR THIS PAGE.
import LoginView from "../../Views/Home/LoginView/LoginView";
import CreateAccountView from "../../Views/Home/CreateAccountView/CreateAccountView";
import VerificationEmailConfirmationView from "../../Views/Home/VerificationEmailConfirmationView/VerificationEmailConfirmationView";

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
      homeView = <LoginView setHomeView={setHomeView} />;
      break;

    case Views.Home.CreateAccount:
      homeView = <CreateAccountView setHomeView={setHomeView} />;
      break;

    case Views.Home.VerificationEmailConfirmation:
      homeView = <VerificationEmailConfirmationView setHomeView={setHomeView} />;
      break;
  }

  return (
    <div className="HomePage">
      <h1 className="subtitle">
        Study <br /> with <br /> excellence.
      </h1>
      <Page>{homeView}</Page>
    </div>
  );
};

export default Home;
