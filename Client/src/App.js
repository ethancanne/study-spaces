import "./App.scss";
import axios from "axios";
import React, { useState, useEffect } from "react";
import "regenerator-runtime/runtime.js";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { signIn, signOut } from "./state/actions";
import Popup from "./Views/Popup/Popup";
import Notification from "./Views/Notification/Notification";

import ResponseMessages from "../../Server/Responses/ResponseMessages.js";
import Routes from "../../Server/Routes/Routes.js";

// PAGES.
import Home from "./Pages/Home/Home.js";
import Study from "./Pages/Study/Study.js";
import Views from "./Views/Views";
import Search from "./Pages/Search/Search";
import StudyGroup from "./Pages/StudyGroup/StudyGroup";
import Account from "./Pages/Account/Account";
import { sendGetRequest } from "../Helper";
import Message from "./Pages/Message/Message";

/**
 * This is the root presentational component that processes user authentication
 * and manages the display of the application"s pages.
 * @author Cameron Burkholder and Ethan Cannelongo
 * @date   10/20/2021
 */
const App = (props) => {
    const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
    const [hasNotMounted, setHasNotMounted] = useState(false);
    const dispatch = useDispatch();
    const popupIsShowing = useSelector((state) => state.popupReducer.isShowing);
    const notificationIsShowing = useSelector((state) => state.notificationReducer.isShowing);

    /**
     * Checks if the page has finished loaded and refreshes the authentication token
     * if the user is already logged in. Using an empty dependency array ensures
     * that this only runs on unmount.
     * @author Cameron Burkholder
     * @date   10/20/2021
     */
    useEffect(() => {
        return () => {
            setHasNotMounted(true);
            updateAuthenticationToken();
        };
    }, []);

    /**
     * Updates the user's authentication token for persistent logins.
     * @author Ethan Cannelongo
     * @date   10/22/2021
     */
    const updateAuthenticationToken = async () => {
        if (isLoggedIn) {
            await sendGetRequest(
                Routes.Account.UpdateAuthenticationToken,
                ResponseMessages.Account.SuccessUpdateAuthenticationToken,
                null,
                true,
                (data, error) => {
                    if (error) {
                        dispatch(signOut());
                        return;
                    }
                    const { authenticationToken, authenticationTokenExpirationDate, user } = data;
                    dispatch(signIn({ authenticationToken, authenticationTokenExpirationDate, user }));
                }
            );
        }
    };

    return (
        <Router>
            <Popup isShowing={popupIsShowing} isLoggedIn={isLoggedIn} />
            <Notification isShowing={notificationIsShowing} />
            <div className="container">
                <Switch>
                    <Route exact path="/">
                        {isLoggedIn ? <Redirect to="/study" /> : <Home />}
                    </Route>

                    <Route
                        path="/verify/:verificationToken"
                        render={(props) => {
                            const accountSetupView = Views.Home.AccountSetup;
                            return isLoggedIn ? (
                                <>
                                    <Redirect to="/study" />
                                </>
                            ) : (
                                <Home {...props} homeView={accountSetupView} />
                            );
                        }}
                    />

                    <Route
                        path="/verifyEmail/:verificationToken"
                        render={(props) => {
                            const accountLoginView = Views.Home.Login;
                            return isLoggedIn ? (
                                <>
                                    <Study {...props} isVerifyingEmail={true} />
                                </>
                            ) : (
                                <Home {...props} homeView={accountLoginView} />
                            );
                        }}
                    />

                    <Route exact path="/study">
                        <Study />
                    </Route>
                    <Route exact path="/search">
                        <Search />
                    </Route>
                    <Route exact path="/message">
                        <Message />
                    </Route>

                    <Route
                        path="/group/:id"
                        render={(props) => {
                            return isLoggedIn ? (
                                <>
                                    <StudyGroup {...props} />
                                </>
                            ) : (
                                <Redirect to="/" />
                            );
                        }}
                    />
                    <Route
                        exact
                        path="/account"
                        render={(props) => {
                            return isLoggedIn ? (
                                <>
                                    <Account />
                                </>
                            ) : (
                                <Redirect to="/" />
                            );
                        }}
                    />
                    <Route
                        path="*"
                        render={(props) => {
                            return <Redirect to="/" />;
                        }}
                    />
                </Switch>
            </div>
        </Router>
    );
};

export default App;
