import axios from "axios";
import React from "react";

import LoginForm from "../../components/LoginForm/LoginForm.js";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages.js";
import Routes from "../../../../Server/Routes/Routes.js";
import Validator from "../../../../Server/Validator.js";

/**
* Used to display the login form and log the user in.
* @param {function} clientSideLogin Used to log the user in from the client-side perspective.
* @param {function} clientSideLogout Used to log the user out from the client-side perspective.
* @author Cameron Burkholder
* @date   10/21/2021
*/
class LoginView extends React.Component {
  constructor(props) {
    super(props);

    this.submitLogin = this.submitLogin.bind(this);
    this.updateEmailField = this.updateEmailField.bind(this);
    this.updatePasswordField = this.updatePasswordField.bind(this);

    const BLANK = "";

    this.state = {
      email: BLANK,
      password: BLANK
    }
  }

  /**
  * Submits the login request to the server for verification.
  * @param {Event} event The form submission event that triggers the login.
  * @author Cameron Burkholder
  * @date   10/21/2021
  */
  async submitLogin(event) {
    // PREVENT THE DEFAULT FORM SUBMISSION BEHAVIOR.
    event.preventDefault();
    event.stopPropagation();

    // SUBMIT THE LOGIN REQUEST.
    let response;
    try {
      response = await axios.post(
        Routes.Account.Login,
        {
          email: this.state.email,
          password: this.state.password
        });
    } catch (error) {
      console.log(error);
    } finally {
      // IF THE LOGIN REQUEST HAS RECEIVED A RESPONSE, CHECK IF THE USER HAS BEEN LOGGED IN.
      const responseIsDefined = (Validator.isDefined(response));
      if (responseIsDefined) {
        // IF THE USER HAS LOGGED IN, CONFIGURE THE CLIENT TO REFLECT THIS.
        const loginWasValid = (ResponseMessages.Account.SuccessLogin === response.data.message);
        if (loginWasValid) {
          const { authenticationToken, authenticationTokenExpirationDate, user } = response.data;
          this.props.clientSideLogin(authenticationToken, authenticationTokenExpirationDate, user);
        } else {
          this.props.clientSideLogout();
        }
      }
    }
  }

  /**
  * Used to update the email field in the login form.
  * @param {Event} event The change event to update the field with.
  * @author Cameron Burkholder
  * @date   10/21/2021
  */
  updateEmailField(event) {
    this.setState({
      email: event.target.value
    });
  }

  /**
  * Used to update the password field in the login form.
  * @param {Event} event The change event to update the field with.
  * @author Cameron Burkholder
  * @date   10/21/2021
  */
  updatePasswordField(event) {
    this.setState({
      password: event.target.value
    });
  }

  render() {
    return (
      <LoginForm
        email={this.state.email}
        password={this.state.password}
        submitLogin={this.submitLogin}
        updateEmailField={this.updateEmailField}
        updatePasswordField={this.updatePasswordField}/>
    )
  }
}

export default LoginView;
