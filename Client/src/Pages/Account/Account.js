import "./Account.scss";
import React, { useState } from "react";
import Routes from "../../../../Server/Routes/Routes";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { showInputPopup, showErrorNotification, showSuccessNotification, signOut } from "../../state/actions";
import TopBar from "../../components/TopBar/TopBar";
import Page from "../Page";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";

/**
 * Renders the Account page
 * @author Stacey Popenfoose
 * @date   2/05/2022
 */
const Account = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authReducer);

    /**
     * Used to submit the new email request
     * @author Ethan Cannelongo
     * @date   02/07/2022
     * @async
     */
    const submitNewEmail = async (newEmail) => {
        // response = await axios.delete(Routes.Account.Delete);
        console.log(newEmail);
    };

    /**
     * Used to submit the new password request
     * @author Ethan Cannelongo
     * @date   02/07/2022
     * @async
     */
    const submitNewPassword = async (newPassword) => {
        // response = await axios.delete(Routes.Account.Delete);
        console.log(newPassword);
    };

    /**
     * Used to submit the delete account request and sign the user out
     * @author Ethan Cannelongo
     * @date   02/07/2022
     * @async
     */
    const submitDeleteAccount = async (currentPassword) => {
        let response;
        try {
            axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

            response = await axios.delete(Routes.Account.Delete, {
                currentPassword
            });
        } catch (error) {
            console.log(error);
            dispatch(showErrorNotification("There was a problem connecting to the server:" + error));
        } finally {
            if (responseIsDefined) {
                // IF THE ACCOUNT DELETION WAS SUCCESSFUL, CONFIGURE THE CLIENT TO REFLECT THIS.
                const accountDeletionWasValid =
                    ResponseMessages.Account.SuccessAccountDeleted === response.data.message;

                if (accountDeletionWasValid) {
                    dispatch(showSuccessNotification(response.data.message));
                    dispatch(signOut());
                } else {
                    dispatch(showErrorNotification("There was an error: " + response.data.message));
                }
            } else {
                dispatch(showErrorNotification("There was an error, the server sent undefined results"));
            }
        }
    };
    return (
        <>
            <TopBar currentPage="account" />
            <Page>
                <div className="page-title">
                    <h1>Account</h1>
                </div>
                <div className="account-page">
                    <div className="infos">
                        <div className="user-info">
                            <h1>Full Name:</h1>
                            <p className="name">{user.name}</p>
                        </div>
                        <div className="user-info">
                            <h1>Email:</h1>
                            <p className="email">{user.email}</p>
                        </div>
                        <div className="user-info">
                            <h1>Area Code:</h1>
                            <p className="areaCode">{user.areaCode}</p>
                        </div>
                        <div className="user-info">
                            <h1>Profile Picture:</h1>
                            <img
                                className="profile-picture"
                                src={" data:image/png;charset=utf-8;base64," + user.profilePicture}
                                alt=""
                            />
                        </div>
                    </div>
                    <div className="edit-account-buttons">
                        <Button
                            type={ButtonTypes.Primary}
                            onClick={() =>
                                dispatch(showInputPopup("Change Email", "New Email", user.email, submitNewEmail))
                            }
                        >
                            Change Email
                        </Button>
                        <Button
                            type={ButtonTypes.Primary}
                            onClick={() =>
                                dispatch(showInputPopup("Change Password", "New Password", "", submitNewPassword))
                            }
                        >
                            Change Password
                        </Button>

                        <Button
                            type={ButtonTypes.Destrucive}
                            onClick={() =>
                                dispatch(
                                    showInputPopup(
                                        "Confirm Password to Delete Account",
                                        "Confirm your password",
                                        "",
                                        submitDeleteAccount
                                    )
                                )
                            }
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </Page>
        </>
    );
};

export default Account;
