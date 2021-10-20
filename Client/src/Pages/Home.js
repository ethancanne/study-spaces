import React from "react";

import Page from "./Page.js";

/**
* The home page of the application.
* @author Cameron Burkholder
* @date   10/20/2021
*/
class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Page>
        <h1>Hello there Capstone team</h1>
      </Page>
    )
  }
}

export default Home;
