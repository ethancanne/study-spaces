import React from "react";

import Page from "./Page.js";
import Views from "../views/Views.js";

// IMPORT VIEWS FOR THIS PAGE.
import LoginView from "../views/Home/LoginView.js";

/**
* The home page of the application. This is shown when the user has not logged in.
* @param {function} clientSideLogin The function used to log in a user from the client-side perspective.
* @param {function} clientSideLogout The function used to log out a user from the client-side perspective.
* @author Cameron Burkholder
* @date   10/20/2021
*/
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: Views.Home.Login
    }
  }
  render() {
    const HomeView = this.state.view;

    return (
      <Page>
        <HomeView
          clientSideLogin={this.props.clientSideLogin}
          clientSideLogout={this.props.clientSideLogout}/>
      </Page>
    )
  }
}

export default Home;
