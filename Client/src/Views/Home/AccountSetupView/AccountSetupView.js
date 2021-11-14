import React, { useEffect, useState } from "react";
import AccountSetupForm from "../../../components/AccountSetupForm/AccountSetupForm";
import Label from "../../../core/Label/Label";
import "./AccountSetupView.scss";
import { useParams } from "react-router-dom";
import Routes from "../../../../../Server/Routes/Routes";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signIn } from "../../../state/actions";
import Button from "../../../core/Button/Button";
import ButtonTypes from "../../../core/Button/ButtonTypes";
import Validator from "../../../../../Server/Validator";
import Views from "../../Views";

const AccountSetupView = (props) => {
  const BLANK = "";
  const [userIsVerified, setUserIsVerified] = useState(false);
  const [fullName, setFullName] = useState(BLANK);
  const [areaCode, setAreaCode] = useState(BLANK);
  const [dateOfBirth, setDateOfBirth] = useState(BLANK);
  const [profilePicture, setProfilePicture] = useState(BLANK);
  const [accountSetupErrorMsg, setAccountSetupErrorMsg] = useState(BLANK);
  const { verificationToken } = useParams();

  const dispatch = useDispatch();

  useEffect(async () => {
    console.log(verificationToken);
    await verifyUser(verificationToken);
  }, []);

  /**
   * Used to verify the user associated with the token that was received from the link
   * @author Ethan Cannelongo
   * @param {String} token The verification token
   * @date   11/13/21
   */
  const verifyUser = async (verificationToken) => {
    // SUBMIT THE VERIFY USER REQUEST.
    let response;
    try {
      response = await axios.post(Routes.Account.Verify, {
        verificationToken
      });
    } catch (error) {
      console.log(error);
    } finally {
      const responseIsDefined = Validator.isDefined(response);
      if (responseIsDefined) {
        // IF THE USER VERIFICATION WAS SUCCESSFUL, CONFIGURE THE CLIENT TO REFLECT THIS.
        const verificationWasValid = ResponseMessages.Account.UserWasVerified === response.data.message;

        if (verificationWasValid) {
          setUser(response.data.unverifiedUser);
          setUserIsVerified(true);
        }
      }
    }
  };

  /**
   * Sends the request to the server for the new (complete) user to be created with the provided information
   * @author Ethan Cannelongo
   * @date   11/13/21
   */
  const submitAccountSetup = async () => {
    // SUBMIT THE CREATE ACCOUNT REQUEST. (Test in Postman)
    let response;
    try {
      response = await axios.post(Routes.Account.SetupAccount, {
        id: user.id,
        fullName,
        areaCode,
        dateOfBirth,
        profilePicture
      });
    } catch (error) {
      console.log(error);
      setAccountCreationErrorMsg("error");
    } finally {
      // IF THE LOGIN REQUEST HAS RECEIVED A RESPONSE, CHECK IF THE USER HAS BEEN LOGGED IN.
      const responseIsDefined = Validator.isDefined(response);
      console.log("ResponseIsDefined" + responseIsDefined);

      if (responseIsDefined) {
        // IF THE ACCOUNT CREATION WAS SUCCESSFUL, CONFIGURE THE CLIENT TO REFLECT THIS.
        const accountSetupWasValid = ResponseMessages.Account.SuccessAccountSetup === response.data.message;

        if (accountSetupWasValid) {
          const user = response.data.user;
          dispatch(signIn(user));
        }
      }
    }
  };

  /**
   * Sets the home view to the sign in form.
   * @author Ethan Cannelongo
   * @date   11/13/21
   */
  const signInClicked = () => {
    props.setHomeView(Views.Home.Login);
  };

  /**
   * Used to update the full name field in the setup account form.
   * @param {Event} event The change event to update the field with.
   * @author Ethan Cannelongo
   * @date   11/13/21
   */
  const updateFullNameField = (event) => {
    setFullName(event.target.value);
    setAccountSetupErrorMsg(BLANK);
  };

  /**
   * Used to update the full name field in the setup account form.
   * @param {Event} event The change event to update the field with.
   * @author Ethan Cannelongo
   * @date   11/13/21
   */
  const updateAreaCodeField = (event) => {
    setAreaCode(event.target.value);
    setAccountSetupErrorMsg(BLANK);
  };

  /**
   * Used to update the date of birth field in the setup account form.
   * @param {Event} event The change event to update the field with.
   * @author Ethan Cannelongo
   * @date   11/13/21
   */
  const updateDateOfBirthField = (event) => {
    setDateOfBirth(event.target.value);
    setAccountSetupErrorMsg(BLANK);
  };

  /**
   * Used to update the full name field in the setup account form.
   * @param {Event} event The change event to update the field with.
   * @author Ethan Cannelongo
   * @date   11/13/21
   */
  const updateProfilePicture = (event) => {
    setProfilePicture(event.target.value);
    setAccountSetupErrorMsg(BLANK);
  };

  return (
    <div className="account-setup-view">
      <h1>Study Spaces</h1>

      {userIsVerified ? (
        <div>
          <AccountSetupForm
            user={user}
            fullName={fullName}
            areaCode={areaCode}
            dateOfBirth={dateOfBirth}
            profilePicture={profilePicture}
            updateFullNameField={updateFullNameField}
            updateAreaCodeField={updateAreaCodeField}
            updateDateOfBirthField={updateDateOfBirthField}
            updateProfilePicture={updateProfilePicture}
            submitAccountSetup={submitAccountSetup}
          />
          <p className="error-message">{accountSetupErrorMsg}</p>
        </div>
      ) : (
        <h1>You shouldn't be here!</h1>
      )}

      <div className="other-options">
        <Label>Already have an account?</Label>
        <Button type={ButtonTypes.Creation} onClick={signInClicked}>
          Sign In
        </Button>
      </div>
    </div>
  );
};
export default AccountSetupView;
