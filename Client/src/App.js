import "./App.scss";
import axios from "axios";
import React, { useState, useEffect } from "react";
import "regenerator-runtime/runtime.js";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { signIn, signOut } from "./state/actions";
import Popup from "./Views/Popup/Popup";

import ResponseMessages from "../../Server/Responses/ResponseMessages.js";
import Routes from "../../Server/Routes/Routes.js";

// PAGES.
import Home from "./Pages/Home/Home.js";
import Study from "./Pages/Study/Study.js";
import Views from "./Views/Views";

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
     * Updates the user"s authentication token for persistent logins.
     * @author Cameron Burkholder
     * @date   10/22/2021
     */
    const updateAuthenticationToken = async () => {
        if (isLoggedIn) {
            axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
            let response = undefined;
            try {
                response = await axios.get(Routes.Account.UpdateAuthenticationToken);
            } catch (error) {
                console.log(error);
            } finally {
                const authenticationTokenWasUpdated =
                    ResponseMessages.Account.SuccessUpdateAuthenticationToken === response.data.message;
                if (authenticationTokenWasUpdated) {
                    const { authenticationToken, authenticationTokenExpirationDate, user } = response.data;
                    dispatch(signIn({ authenticationToken, authenticationTokenExpirationDate, user }));
                } else {
                    dispatch(signOut());
                }
                setHasNotMounted(false);
            }
        }
    };

    const verifyUser = (verificationToken) => {};
    
    return (
        <Router>
            <Popup isShowing={popupIsShowing} />
            <div className="container">
                <Switch>
                    <Route exact path="/">
                        {isLoggedIn ? <Redirect to="/study" /> : <Home />}
                    </Route>
                    <Route exact path="/study">
                        <Study />
                    </Route>
                    <Route
                        path="/verify/:verificationToken"
                        render={(props) => {
                            const accountSetupView = Views.Home.AccountSetup;
                            return isLoggedIn ? (
                                <Redirect to="/study" />
                            ) : (
                                <Home {...props} homeView={accountSetupView} />
                            );
                        }}
                    />
                </Switch>
            </div>
        </Router>
    );
};

export default App;
