import axios from "axios";
import React, {useState} from 'react'
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
const App = (props) => {
    // BIND METHODS TO THIS COMPONENT INSTANCE.
    // this.clientSideLogin = this.clientSideLogin.bind(this);
    // this.clientSideLogout = this.clientSideLogout.bind(this);
    // this.updateAuthenticationToken = this.updateAuthenticationToken.bind(this);
    // this.userIsLoggedIn = this.userIsLoggedIn.bind(this);

    const [isLoggedIn, setIsLoggedIn] = useState(userIsLoggedIn())
    const [hasNotMounted, setHasNotMounted] = useState(false)


  /**
  * Logs the user in from the client-side perspective. This ensures persistent logins.
  * @param {JsonWebToken} token The authentication token to store.
  * @param {Date} expirationDate The date the authentication token expires.
  * @param {User} user The user being logged in.
  * @author Cameron Burkholder
  * @date   10/22/2021
  */
  const clientSideLogin = (token, expirationDate, user) =>{
    //this.setLocalStorage(authenticationToken, authenticationTokenExpirationDate, user, this.updateState);
  }

  /**
  * Logs the user out from the clien-side perspective.
  * @author Cameron Burkholder
  * @date   10/22/2021
  */
  const clientSideLogout = ()=> {
    //this.clearLocalStorage();

  }

  /**
  * Checks if the page has finished loaded and refreshes the authentication token
  * if the user is already logged in.
  * @author Cameron Burkholder
  * @date   10/20/2021
  */

   useEffect(() => {
       return () => {
          setHasNotMounted(true)
          updateAuthenticationToken()
       }
   }, []) // Using an empty dependency array ensures this only runs on unmount

  // componentDidMount() {
  //   if (this.state.hasNotMounted) {
  //     this.setState({
  //       hasNotMounted: false
  //     }, this.updateAuthenticationToken);
  //   }
  // }

  /**
  * Updates the user's authenticaiton token for persistent logins.
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
        const authenticationTokenWasUpdated = (ResponseMessages.Account.SuccessUpdateAuthenticationToken === response.data.message);
        if (authenticationTokenWasUpdated) {
          const { authenticationToken, authenticationTokenExpirationDate, user } = response.data;
          clientSideLogin(authenticationToken, authenticationTokenExpirationDate, user);
        } else {
          clientSideLogout();
        }
        setHasNotMounted(false)
      }
    }
  }

  /**
  * Tests whether a user is logged in or not.
  * @return {boolean} True if the user is logged in, false otherwise.
  * @author Cameron Burkholder
  * @date   10/20/2021
  */
  const userIsLoggedIn = ()=>{
    // CHECK IF THE JWT TOKEN IS EXPIRED.
    const currentDate = Date.now();
    const jwtExpirationDate = new Date(localStorage.getItem("authenticationTokenExpirationDate"));
    const userIsLoggedIn = (currentDate < jwtExpirationDate);
    return userIsLoggedIn;
  }


    return (
      <Router>
        <div className="container">
          <Switch>
            <Route exact path="/">
              <Home clientSideLogin={clientSideLogin} clientSideLogout={clientSideLogout}/>
            </Route>
          </Switch>
        </div>
      </Router>
    )
}

export default App;
