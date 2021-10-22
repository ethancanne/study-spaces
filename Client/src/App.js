import axios from "axios";
import React from "react";
import "regenerator-runtime/runtime.js";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Redirect } from "react-router";

import ResponseMessages from "../../Server/Responses/ResponseMessages.js";
import Routes from "../../Server/Routes/Routes.js";

// PAGE ELEMENTS.


// PAGES.
import Home from "./pages/Home.js";

/**
* This is the root presentational component that processes user authentication
* and manages the display of the application's pages.
* @author Cameron Burkholder
* @date   10/20/2021
*/
class App extends React.Component {
  constructor(props) {
    super(props);

    // BIND METHODS TO THIS COMPONENT INSTANCE.
    this.clientSideLogin = this.clientSideLogin.bind(this);
    this.clientSideLogout = this.clientSideLogout.bind(this);
    this.updateAuthenticationToken = this.updateAuthenticationToken.bind(this);
    this.userIsLoggedIn = this.userIsLoggedIn.bind(this);

    this.state = {
      isLoggedIn: this.userIsLoggedIn(),
      hasNotMounted: true
    }
  }

  /**
  * Logs the user in from the client-side perspective. This ensures persistent logins.
  * @param {JsonWebToken} token The authentication token to store.
  * @param {Date} expirationDate The date the authentication token expires.
  * @param {User} user The user being logged in.
  * @author Cameron Burkholder
  * @date   10/22/2021
  */
  clientSideLogin(token, expirationDate, user) {
    //this.setLocalStorage(authenticationToken, authenticationTokenExpirationDate, user, this.updateState);
  }

  /**
  * Logs the user out from the clien-side perspective.
  * @author Cameron Burkholder
  * @date   10/22/2021
  */
  clientSideLogout() {
    //this.clearLocalStorage();

  }

  /**
  * Checks if the page has finished loaded and refreshes the authentication token
  * if the user is already logged in.
  * @author Cameron Burkholder
  * @date   10/20/2021
  */
  componentDidMount() {
    if (this.state.hasNotMounted) {
      this.setState({
        hasNotMounted: false
      }, this.updateAuthenticationToken);
    }
  }

  /**
  * Updates the user's authenticaiton token for persistent logins.
  * @author Cameron Burkholder
  * @date   10/22/2021
  */
  async updateAuthenticationToken() {
    if (this.state.isLoggedIn) {
      axios.defaults.headers.common["Authorization"] = localStorage.getItem("authenticationToken");
      let response = undefined;
      try {
        response = await axios.get(Routes.Account.UpdateAuthenticationToken);
      } catch (error) {
        console.log(error);
      } finally {
        const authenticationTokenWasUpdated = (ResponseMessages.Account.SuccessUpdateAuthenticationToken === response.data.message);
        if (authenticationTokenWasUpdated) {
          const { authenticationToken, authenticationTokenExpirationDate, user } = response.data;
          this.clientSideLogin(authenticationToken, authenticationTokenExpirationDate, user);
        } else {
          this.clientSideLogout();
        }
        this.setState({
          hasNotMounted: false
        });
      }
    }
  }

  /**
  * Tests whether a user is logged in or not.
  * @return {boolean} True if the user is logged in, false otherwise.
  * @author Cameron Burkholder
  * @date   10/20/2021
  */
  userIsLoggedIn() {
    // CHECK IF THE JWT TOKEN IS EXPIRED.
    const currentDate = Date.now();
    const jwtExpirationDate = new Date(localStorage.getItem("authenticationTokenExpirationDate"));
    const userIsLoggedIn = (currentDate < jwtExpirationDate);
    return userIsLoggedIn;
  }


  render() {
    return (
      <Router>
        <div className="container">
          <Switch>
            <Route exact path="/">
              <Home clientSideLogin={this.clientSideLogin} clientSideLogout={this.clientSideLogout}/>
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;
