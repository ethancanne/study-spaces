import "./CreateAccountView.scss";

import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import CreateAccountForm from "../../../components/CreateAccountForm/CreateAccountForm";
import Routes from "../../../../../Server/Routes/Routes.js";
import ButtonTypes from "../../../core/Button/ButtonTypes.js";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages.js";
import Button from "../../../core/Button/Button.js";
import Label from "../../../core/Label/Label.js";
import Views from "../../Views.js";

import { useDispatch } from "react-redux";
import {createAccount} from "./state/actions";

const CreateAccountView = (props) => {
  const BLANK = "";
  const [email, setEmail] = useState(BLANK);
  const [password, setPassword] = useState(BLANK);
  const [confirmPassword, setConfirmPassword] = useState(BLANK);
  const [accountCreationErrorMsg, setAccountCreationErrorMsg] = useState(BLANK);

  const dispatch = useDispatch();

  /**
   * Submits the create account request to the server for verification.
   * @param {Event} event The form submission event that triggers the login.
   * @author Ethan Cannelongo
   * @date   10/21/2021
   */
  const submitAccountCreation = async (event) => {
    // PREVENT THE DEFAULT FORM SUBMISSION BEHAVIOR.
    event.preventDefault();
    event.stopPropagation();

    // FIRST, COMPARE THE PASSWORD AND CONFIRM PASSWORD FIELDS
    if (password !== confirmPassword) {
      setAccountCreationErrorMsg("Passwords don't match!");
      return;
    }

    // SUBMIT THE CREATE ACCOUNT REQUEST. (Test in Postman)
    let response;
    try {
      response = await axios.post(Routes.Account.CreateAccount, {
        user:{
          email,
          password,
          password_confirmation: confirmPassword
        }
      });
    } catch (error) {
      console.log(error);
      setLoginErrorMsg(loginErrorMsg);
    } finally {
      // IF THE LOGIN REQUEST HAS RECEIVED A RESPONSE, CHECK IF THE USER HAS BEEN LOGGED IN.
      const responseIsDefined = Validator.isDefined(response);
      if (responseIsDefined) {

        // IF THE ACCOUNT CREATION WAS SUCCESSFUL, CONFIGURE THE CLIENT TO REFLECT THIS.
           const accountCreationWasValid = ResponseMessages.Account.SuccessAccountCreation === response.data.message;


          if (accountCreationWasValid) {
              // save the unverified user in state (using dispatch)
              // set the home view to the check email screen
              const unverifiedUser = JSON.parse(response.data.unverifiedUser);
              dispatch(createAccount(unverifiedUser));
              
          }
        
        //       const { authenticationToken, authenticationTokenExpirationDate, user } = response.data;
        //       dispatch(signIn({ authenticationToken, authenticationTokenExpirationDate, user }));
        //     } else {
        //       setLoginErrorMsg(response.data.message);
        //       dispatch(signOut);
        //     }
      }
    }
  };

  /**
   * Used to update the email field in the create account form.
   * @param {Event} event The change event to update the field with.
   * @author Cameron Burkholder
   * @date   10/21/2021
   */
  const updateEmailField = (event) => {
    setEmail(event.target.value);
    setLoginErrorMsg(BLANK);
  };

  /**
   * Used to update the password field in the create account form.
   * @param {Event} event The change event to update the field with.
   * @author Cameron Burkholder
   * @date   10/21/2021
   */
  const updatePasswordField = (event) => {
    setPassword(event.target.value);
    setLoginErrorMsg(BLANK);
  };

  /**
   * Used to update the confirm password field in the create account form.
   * @param {Event} event The change event to update the field with.
   * @author Ethan Cannelongo
   * @date   10/21/2021
   */
  const updateConfirmPasswordField = (event) => {
    setConfirmPassword(event.target.value);
    setAccountCreationErrorMsg(BLANK);
  };

  /**
   * Sets the home view to the sign in form.
   * @param {Event} event The change event to update the field with.
   * @author Ethan Cannelongo
   * @date   10/21/2021
   */
  const signInClicked = (event) => {
    props.setHomeView(Views.Home.Login);
  };

  return (
    <div className="create-account-view">
      <CreateAccountForm
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        submitAccountCreation={submitAccountCreation}
        updateEmailField={updateEmailField}
        updatePasswordField={updatePasswordField}
        updateConfirmPasswordField={updateConfirmPasswordField}
        accountCreationErrorMsg={accountCreationErrorMsg}
      />
      <p className="error-message">{accountCreationErrorMsg}</p>

      <div className="other-options">
        <Label>Already have an account?</Label>
        <Button type={ButtonTypes.Primary} onClick={signInClicked}>
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default CreateAccountView;
