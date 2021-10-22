import React from "react";

class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="SplashScreen">
        <h1>This is the splash screen</h1>
        <button onClick={this.props.showLoginForm}>Login</button>
      </div>
    )
  }
}

export default SplashScreen;
