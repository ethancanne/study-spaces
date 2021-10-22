import React from "react";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="LoginForm">
        <h1>This is the login screen</h1>
        <button onClick={this.props.showRegisterForm}>Register</button>
      </div>
    )
  }
}

export default LoginForm;
