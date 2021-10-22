import React from "react";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="RegisterForm">
        <h1>This is where users can register</h1>
        <button onClick={this.props.showLoginForm}>Login</button>
      </div>
    )
  }
}

export default RegisterForm;
