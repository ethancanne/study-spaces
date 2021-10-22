import React from "react";

import Page from "./Page.js";
import Views from "../Views/Views.js";

// IMPORT VIEWS FOR THIS PAGE.
import LoginForm from "../Views/Home/LoginForm.js";
import RegisterForm from "../Views/Home/RegisterForm.js";
import SplashScreen from "../Views/Home/SplashScreen.js";

/**
* The home page of the application.
* @author Cameron Burkholder
* @date   10/20/2021
*/
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.showLoginForm = this.showLoginForm.bind(this);
    this.showRegisterForm = this.showRegisterForm.bind(this);
    this.showSplashScreen = this.showSplashScreen.bind(this);

    this.state = {
      view: Views.Home.SplashScreen
    }
  }
  showLoginForm() {
    this.setState({
      view: Views.Home.LoginForm
    });
  }
  showRegisterForm() {
    this.setState({
      view: Views.Home.RegisterForm
    });
  }
  showSplashScreen() {
    this.setState({
      view: Views.Home.SplashScreen
    });
  }
  render() {
    let view;
    switch (this.state.view) {
      case Views.Home.SplashScreen:
        view = <SplashScreen showLoginForm={this.showLoginForm}/>;
        break;
      case Views.Home.LoginForm:
        view = <LoginForm showRegisterForm={this.showRegisterForm}/>;
        break;
      case Views.Home.RegisterForm:
        view = <RegisterForm showLoginForm={this.showLoginForm}/>;
        break;
    }
    return (
      <Page>
        { view }
        <button onClick={this.showSplashScreen}>Splash screen</button>
      </Page>
    )
  }
}

export default Home;
