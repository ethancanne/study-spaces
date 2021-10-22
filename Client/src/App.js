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
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.updateAuthenticationToken = this.updateAuthenticationToken.bind(this);
    this.userIsLoggedIn = this.userIsLoggedIn.bind(this);

    this.state = {
      isLoggedIn: this.userIsLoggedIn(),
      hasNotMounted: true
    }
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

  login(token, expirationDate, user) {
    this.setLocalStorage(authenticationToken, authenticationTokenExpirationDate, user, this.updateState);
  }

  logout() {
    this.clearLocalStorage();

  }

  async updateAuthenticationToken() {
    if (this.state.isLoggedIn) {
      axios.defaults.headers.common["Authorization"] = localStorage.getItem("authenticationToken");
      let response = undefined;
      try {
        response = await axios.get(Routes.Account.UpdateAuthenticationToken);
      } catch (error) {
        console.log(error);
      } finally {
        const authenticationTokenWasUpdated = (ResponseMessages.Account.AuthenticationTokenWasUpdated === response.data.message);
        if (authenticationTokenWasUpdated) {
          const { authenticationToken, authenticationTokenExpirationDate, user } = response.data;
          this.login(authenticationToken, authenticationTokenExpirationDate, user);
        } else {
          this.logout();
        }
        this.setState({
          hasNotMounted: false
        });
      }
    }
  }

  /**
  * Tests whether a user is logged in or not.j
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
              <Home/>
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;
