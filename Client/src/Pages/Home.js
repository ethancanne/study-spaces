import React from "react";

import Page from "./Page.js";
import Views from "../views/Views.js";

// IMPORT VIEWS FOR THIS PAGE.
import LoginView from "../views/Home/LoginView.js";

/**
* The home page of the application. This is shown when the user has not logged in.
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
        <HomeView/>
      </Page>
    )
  }
}

export default Home;
