import "./Account.scss";
import React, { useState } from "react";
import Routes from "../../../../Server/Routes/Routes";
import axios from "axios";
import { performSignOut, sendDeleteRequest, sendPostRequest } from "../../../Helper";
import { useSelector, useDispatch } from "react-redux";
import {
    showInputPopup,
    showErrorNotification,
    showSuccessNotification,
    signOut,
    closePopup
} from "../../state/actions";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";
import Validator from "../../../../Server/Validator";
import TopBar from "../../components/TopBar/TopBar";
import Page from "../Page";
import ButtonTypes from "../../core/Button/ButtonTypes";
import Button from "../../core/Button/Button";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import Loading from "../../components/Loading/Loading";

/**
 * Renders the Account page
 * @author Stacey Popenfoose
 * @date   2/05/2022
 */
const Account = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authReducer);
    const isLoading = useSelector((state) => state.notificationReducer.loading);

    /**
     * Used to submit the new email request
     * @author Ethan Cannelongo
     * @date   02/11/2022
     * @async
     */
    const submitNewEmail = async (newEmail, currentPassword) => {
        await sendPostRequest(
            Routes.Account.ChangeEmail,
            {
                newEmail,
                currentPassword
            },
            ResponseMessages.Account.EmailSent,
            null,
            true,
            (date, error) => {
                if (error) return;
                dispatch(closePopup());
            }
        );
    };

    /**
     * Used to submit the new password request
     * @author Ethan Cannelongo
     * @date   02/07/2022
     * @async
     */
    const submitNewPassword = async (currentPassword, newPassword) => {
        await sendPostRequest(
            Routes.Account.ChangePassword,
            {
                currentPassword,
                newPassword
            },
            ResponseMessages.Account.SuccessChangingPassword,
            null,
            true,
            (date, error) => {
                if (error) return;
                dispatch(closePopup());
            }
        );
    };

    /**
     * Used to submit the delete account request and sign the user out
     * @author Ethan Cannelongo
     * @date   02/07/2022
     * @async
     */
    const submitDeleteAccount = async (currentPassword) => {
        await sendDeleteRequest(
            Routes.Account.Delete,
            { currentPassword },
            ResponseMessages.Account.SuccessAccountDeleted,
            null,
            true,
            (data, error) => {
                if (error) return;
                dispatch(signOut());
                dispatch(closePopup());
                performSignOut();
            }
        );
    };
    return (
        <>
            <Page topBar={true} currentPage={""}>
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
                            <ProfilePicture image={user.profilePicture} name={user.name} />
                        </div>
                    </div>
                    <div className="edit-account-buttons">
                        <Button
                            type={ButtonTypes.Primary}
                            onClick={() =>
                                dispatch(
                                    showInputPopup("Change Email", "New Email", "", submitNewEmail, "Current Password")
                                )
                            }
                        >
                            Change Email
                        </Button>
                        <Button
                            type={ButtonTypes.Primary}
                            onClick={() =>
                                dispatch(
                                    showInputPopup(
                                        "Change Password",
                                        "Current Password",
                                        "",
                                        submitNewPassword,
                                        "New Password"
                                    )
                                )
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
