import React from "react";

import Page from "./Page.js";
import Views from "../Views/Views.js";

/**
* The home page of the application.
* @author Cameron Burkholder
* @date   10/20/2021
*/
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: Views.Home.LandingPage
    }
  }
  render() {
    let view;
    switch (this.state.view) {
      case Views.Home.LandingPage:
        view = (
          <div>
            <h1>This is the landing page</h1>
            <button onClick={() => {
              this.setState({
                view: Views.Home.Login
              })
            }}>login</button>
          </div>
        );
        break;
      case Views.Home.Login:
        view = (
          <h1>This is where you could login</h1>
        );
        break;
      case Views.Home.Register:
        view = (
          <h1>This is where you could register</h1>
        );
        break;
    }
    return (
      <Page>
        { view }
      </Page>
    )
  }
}

export default Home;
