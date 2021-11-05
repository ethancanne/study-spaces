import axios from "axios";
import React, {useState, useEffect} from "react";
import "regenerator-runtime/runtime.js";
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import {Redirect} from "react-router";

import ResponseMessages from "../../Server/Responses/ResponseMessages.js";
import Routes from "../../Server/Routes/Routes.js";

// PAGES.
import Home from "./pages/Home.js";
import Study from "./Pages/Study.js";

/**
 * This is the root presentational component that processes user authentication
 * and manages the display of the application"s pages.
 * @author Cameron Burkholder
 * @date   10/20/2021
 */
const App = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(userIsLoggedIn());
  const [hasNotMounted, setHasNotMounted] = useState(false);

  /**
   * Logs the user in from the client-side perspective. This ensures persistent logins.
   * @param {JsonWebToken} token The authentication token to store.
   * @param {Date} expirationDate The date the authentication token expires.
   * @param {User} user The user being logged in.
   * @author Cameron Burkholder
   * @date   10/22/2021
   */
  const clientSideLogin = (token, expirationDate, user) => {
    setLocalStorage(token, expirationDate, user);
    setIsLoggedIn(true);
  }

  /**
   * Logs the user out from the clien-side perspective.
   * @author Cameron Burkholder
   * @date   10/22/2021
   */
  const clientSideLogout = () => {
    clearLocalStorage();
    setIsLoggedIn(false);
  }

  /**
   * Clears the data managed by the application.
   * @author Cameron Burkholder
   * @date   11/03/2021
   */
  function clearLocalStorage() {
    localStorage.clear();
  }

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
    }
  }, [])

  /**
   * Sets the local storage managed by the application.
   * @param {String} token The JSON web token used for user authentication.
   * @param {Date} expirationDate The date the token expires.
   * @param {User} user The user being logged in.
   * @author Cameron Burkholder
   * @date   11/03/2021
   */
  function setLocalStorage(token, expirationDate, user) {
    // STORE THE AUTHENTICATION INFORMATION.
    localStorage.setItem("token", token);
    localStorage.setItem("authenticationTokenExpirationDate", expirationDate);
    localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Tests whether a user is logged in or not.
   * @return {Boolean} True if the user is logged in, false otherwise.
   * @author Cameron Burkholder
   * @date   10/20/2021
   */
  function userIsLoggedIn() {
    // CHECK IF THE JWT TOKEN IS EXPIRED.
    const currentDate = Date.now();
    const jwtExpirationDate = new Date(
      localStorage.getItem("authenticationTokenExpirationDate")
    )
    const userIsLoggedIn = currentDate < jwtExpirationDate;
    return userIsLoggedIn;
  }

  /**
   * Updates the user"s authentication token for persistent logins.
   * @author Cameron Burkholder
   * @date   10/22/2021
   */
  const updateAuthenticationToken = async () => {
    if (isLoggedIn) {
      axios.defaults.headers.common["Authorization"] = localStorage.getItem("authenticationToken");
      let response = undefined;
      try {
        response = await axios.get(Routes.Account.UpdateAuthenticationToken);
      } catch (error) {
        console.log(error);
      } finally {
        const authenticationTokenWasUpdated =
          ResponseMessages.Account.SuccessUpdateAuthenticationToken ===
          response.data.message;
        if (authenticationTokenWasUpdated) {
          const {authenticationToken, authenticationTokenExpirationDate, user} = response.data;
          clientSideLogin(
            authenticationToken,
            authenticationTokenExpirationDate,
            user
          );
        } else {
          clientSideLogout();
        }
        setHasNotMounted(false);
      }
    }
  }

  return (
    <Router>
      <div className="container">
        <Switch>
          <Route exact path="/">
            { isLoggedIn ? (
              <Study
                clientSideLogout={clientSideLogout}
                isLoggedIn={true}
                user={JSON.parse(localStorage.getItem("user"))}/>
            ) : (
              <Home
                clientSideLogin={clientSideLogin}/>
            )}
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;
