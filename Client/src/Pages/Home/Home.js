import React, { useState, useEffect } from "react";

import "./Home.scss";

import Page from "../Page.js";
import Views from "../../Views/Views.js";

// IMPORT VIEWS FOR THIS PAGE.
import LoginView from "../../Views/Home/LoginView/LoginView";
import CreateAccountView from "../../Views/Home/CreateAccountView/CreateAccountView";
import VerificationEmailConfirmationView from "../../Views/Home/VerificationEmailConfirmationView/VerificationEmailConfirmationView";
import AccountSetupView from "../../Views/Home/AccountSetupView/AccountSetupView";
import Validator from "../../../../Server/Validator.js";

/**
 * The home page of the application. This is shown when the user has not logged in.
 * @param {function} clientSideLogin The function used to log in a user from the client-side perspective.
 * @param {function} clientSideLogout The function used to log out a user from the client-side perspective.
 * @param {String} homeView The view that is supposed to be displayed on the home page, defined in Views.js
 * @author Cameron Burkholder and Ethan Cannelongo
 * @date   10/20/2021
 */
const Home = (props) => {
    const [view, setHomeView] = useState(props.homeView ? props.homeView : Views.Home.Login);
    let homeView = <></>;
    // let verificationToken = undefined;
    // const verificationTokenExists = Validator.isDefined(props.match);
    // if (verificationTokenExists) {
    //   verificationToken = props.match.params.verificationToken;
    // }

    //
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

        case Views.Home.AccountSetup:
            homeView = (
                <AccountSetupView setHomeView={setHomeView} verificationToken={props.match.params.verificationToken} />
            );
            break;
    }

    return (
        <Page>
            <div className="HomePage">
                <h1 className="subtitle">
                    Study <br /> with <br /> excellence.
                </h1>
                <Page>{!props.children ? homeView : props.children}</Page>
            </div>
        </Page>
    );
};

export default Home;
