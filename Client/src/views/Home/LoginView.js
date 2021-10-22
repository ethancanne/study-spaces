import React from "react";

import Button from "../../core/Button/Button.js";
import ButtonTypes from "../../core/Button/ButtonTypes.js";
import Form from "../../core/Form/Form.js";
import InputField from "../../core/InputField/InputField.js";
import Label from "../../core/Label/Label.js";
import Routes from "../../../../Server/Routes/Routes.js";
import TextInput from "../../core/Inputs/TextInput/TextInput.js";

/**
* Used to display the login form and log the user in.
* @author Cameron Burkholder
* @date   10/21/2021
*/
class LoginView extends React.Component {
  constructor(props) {
    super(props);

    this.updateEmailField = this.updateEmailField.bind(this);
    this.updatePasswordField = this.updatePasswordField.bind(this);

    const BLANK = "";

    this.state = {
      email: BLANK,
      password: BLANK
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
      <Form>
        <InputField>
          <Label>Email</Label>
          <TextInput value={this.state.email} onChange={this.updateEmailField} type="email"/>
        </InputField>
        <InputField>
          <Label>Password</Label>
          <TextInput value={this.state.password} onChange={this.updatePasswordField} type="password"/>
        </InputField>
        <Button type={ButtonTypes.Primary}>Sign in</Button>
      </Form>
    )
  }
}

export default LoginView;
