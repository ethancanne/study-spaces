import axios from "axios";
import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Redirect } from "react-router";

// PAGE ELEMENTS.


// PAGES.
import Home from "./Pages/Home.js";

/**
* This is the root presentational component that processes user authentication
* and manages the display of the application's pages.
* @author Cameron Burkholder
* @date   10/20/2021
*/
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
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
