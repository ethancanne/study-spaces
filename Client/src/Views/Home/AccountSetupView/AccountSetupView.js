import React, { useEffect, useState } from "react";
import AccountSetupForm from "../../../components/AccountSetupForm/AccountSetupForm";
import Label from "../../../core/Label/Label";
import { useParams } from "react-router-dom";
import Routes from "../../../../../Server/Routes/Routes";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signIn, showErrorNotification, showSuccessNotification } from "../../../state/actions";
import Button from "../../../core/Button/Button";
import ButtonTypes from "../../../core/Button/ButtonTypes";
import Validator from "../../../../../Server/Validator";
import Views from "../../Views";
import InputField from "../../../core/InputField/InputField";
import AuthView from "../AuthView";
import { sendPostRequest } from "../../../../Helper";

/**
 * Once the user has verified their account and clicked the link, this view is used to present the acount setup form so they can offically create their account on the home page
 * @param {function} setHomeView Used to set the view of this page, if the user presses the log in button
 * @author Ethan Cannelongo
 * @date   10/21/2021
 */
const AccountSetupView = (props) => {
    const BLANK = "";
    const [userIsVerified, setUserIsVerified] = useState(false);
    const [name, setName] = useState(BLANK);
    const [areaCode, setAreaCode] = useState(BLANK);
    const [is18OrOver, setIs18OrOver] = useState(false);
    const [profilePicture, setProfilePicture] = useState(BLANK);
    const [user, setUser] = useState({});
    const verificationToken = props.verificationToken;

    const dispatch = useDispatch();

    useEffect(async () => {
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
        sendPostRequest(
            Routes.Account.GetUnverifiedUser,
            { verificationToken: verificationToken },
            ResponseMessages.Account.UnverifiedUserWasFound,
            null,
            true,
            (data, error) => {
                if (error) return;
                setUser(data.unverifiedUser);
                setUserIsVerified(true);
            }
        );
    };

    /**
     * Sends the request to the server for the new (complete) user to be created with the provided information
     * @author Ethan Cannelongo
     * @date   11/13/21
     */
    const submitAccountSetup = async (event) => {
        // SUBMIT THE CREATE ACCOUNT REQUEST.
        event.preventDefault();
        event.stopPropagation();

        if (!is18OrOver) {
            console.log("NOT 18");
            dispatch(showErrorNotification("You need to be 18 or older to sign up"));
            return;
        }

        let response;
        try {
            const formData = new FormData();
            formData.append("profilePicture", profilePicture);
            formData.append("verificationToken", verificationToken);
            formData.append("user", user);
            formData.append("name", name);
            formData.append("areaCode", areaCode);
            formData.append("is18OrOver", is18OrOver);

            response = await axios.post(Routes.Account.SetupAccount, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        } catch (error) {
            console.log(error);
            dispatch(showErrorNotification("There was a problem connecting to the server:" + error));
        } finally {
            // IF THE LOGIN REQUEST HAS RECEIVED A RESPONSE, CHECK IF THE USER HAS BEEN LOGGED IN.
            const responseIsDefined = Validator.isDefined(response);

            if (responseIsDefined) {
                // IF THE ACCOUNT CREATION WAS SUCCESSFUL, CONFIGURE THE CLIENT TO REFLECT THIS.
                const accountSetupWasValid = ResponseMessages.Account.SuccessAccountSetup === response.data.message;

                if (accountSetupWasValid) {
                    const { authenticationToken, authenticationTokenExpirationDate, user, studyGroups } = response.data;
                    dispatch(signIn({ authenticationToken, authenticationTokenExpirationDate, user }));
                    dispatch(showSuccessNotification("Successfully signed in: " + response.user.name));
                } else {
                    dispatch(showErrorNotification(response.data.message));
                }
            } else {
                dispatch(showErrorNotification("There was a problem creating your account"));
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
    const updateNameField = (event) => {
        setName(event.target.value);
    };

    /**
     * Used to update the full name field in the setup account form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   11/13/21
     */
    const updateAreaCodeField = (event) => {
        setAreaCode(event.target.value);
    };

    /**
     * Used to update the date of birth field in the setup account form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   11/13/21
     */
    const updateIs18OrOver = (event) => {
        setIs18OrOver(event.target.checked);
    };

    /**
     * Used to update the full name field in the setup account form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   11/13/21
     */
    const updateProfilePicture = (event) => {
        setProfilePicture(event.target.files[0]);
    };

    return (
        <AuthView>
            <h3>Setup Your Account</h3>
            <p>{user.email}</p>
            {userIsVerified ? (
                <div>
                    <AccountSetupForm
                        user={user}
                        name={name}
                        areaCode={areaCode}
                        is18OrOver={is18OrOver}
                        profilePicture={profilePicture}
                        updateNameField={updateNameField}
                        updateAreaCodeField={updateAreaCodeField}
                        updateIs18OrOver={updateIs18OrOver}
                        updateProfilePicture={updateProfilePicture}
                        submitAccountSetup={submitAccountSetup}
                    />
                </div>
            ) : (
                <h1>You shouldn't be here!</h1>
            )}

            <div className="other-options">
                <p>Already have an account?</p>
                <Button type={ButtonTypes.Creation} onClick={signInClicked}>
                    Sign In
                </Button>
            </div>
        </AuthView>
    );
};
export default AccountSetupView;
