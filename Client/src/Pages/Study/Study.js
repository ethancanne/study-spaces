import "./Study.scss";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut, showCreateStudyGroupPopup, loadStudyGroup, showErrorNotification } from "../../state/actions";
import Validator from "../../../../Server/Validator";
import Routes from "../../../../Server/Routes/Routes";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";

import Button from "../../core/Button/Button.js";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";

import TopBar from "../../components/TopBar/TopBar";
import StudyGroupView from "../../Views/Study/studyGroupView/StudyGroupView";
import Page from "../Page";

/**
 * Renders the study page, displaying all the study groups the user is a member of.
 * @author Ethan Cannelongo
 * @date   11/20/2021
 */
const Study = (props) => {
    const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
    const user = useSelector((state) => state.authReducer.user);
    const studyGroups = useSelector((state) => state.studyGroupsReducer.studyGroups);

    const dispatch = useDispatch();

    useEffect(() => {
        async function getGroups() {
            await getStudyGroups();
        }
        getGroups();

        async function verifyUserEmail() {
            await verifyEmail(props.verificationToken);
        }
        if (props.verificationToken) verifyUserEmail();
    }, []);

    /**
     * Retrieves all study groups the user is a member of from the server
     * @author Ethan Cannelongo
     * @date   11/20/2021
     */
    const getStudyGroups = async () => {
        let response;
        try {
            axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

            response = await axios.get(Routes.StudyGroup.GetUserStudyGroups);
        } catch (e) {
            dispatch(
                showErrorNotification(
                    "There's been an error loading your study groups.  Please try again later. " + e.message
                )
            );
        } finally {
            const responseIsDefined = Validator.isDefined(response);

            if (responseIsDefined) {
                const studyGroupCreationWasValid =
                    ResponseMessages.StudyGroup.SuccessStudyGroupsRetrieved === response.data.message;

                if (studyGroupCreationWasValid) {
                    const studyGroups = response.data.studyGroups;
                    if (studyGroups) {
                        studyGroups.map((s) => {
                            dispatch(loadStudyGroup(studyGroups));
                        });
                    }
                } else {
                    dispatch(
                        showErrorNotification(
                            "There's been an error loading your study groups.  Please try again later."
                        )
                    );
                }
            } else {
                dispatch(
                    showErrorNotification("There's been an error loading your study groups.  Please try again later.")
                );
            }
        }
    };

    /**
     * Used to verify the email, if a user changed their email, from a
     * token that was received from the link
     * @author Ethan Cannelongo
     * @param {String} verificationToken The verification token
     * @date   02/09/22
     */
    const verifyEmail = async (verificationToken) => {
        // SUBMIT THE VERIFY USER REQUEST.
        let response;
        try {
            response = await axios.post(Routes.Account.PUTVERIFYEMAILROUTEHERE, {
                verificationToken: verificationToken
            });
        } catch (e) {
            dispatch(showErrorNotification("Verification failed: " + error.message));
        } finally {
            const responseIsDefined = Validator.isDefined(response);
            if (responseIsDefined) {
                // IF THE USER VERIFICATION WAS SUCCESSFUL, CONFIGURE THE CLIENT TO REFLECT THIS.
                const verificationWasValid =
                    ResponseMessages.Account.PUTEMAILVERIFICATIONWASVAILIDMESSAGEHERE === response.data.message;

                if (verificationWasValid) {
                    dispatch(showSuccessNotification("Your email has been successfully verified!"));
                } else {
                    dispatch(showErrorNotification("Email verification failed: " + response.data.message));
                }
            } else {
                dispatch(showErrorNotification("Email verification failed: Undefined response."));
            }
        }
    };

    return (
        <div>
            <TopBar currentPage="study" />

            <Page>
                <div className="study-page">
                    <div className="page-title">
                        <h1>Study</h1>
                    </div>
                    {isLoggedIn ? (
                        <div>
                            <button
                                className="add-button"
                                onClick={() => dispatch(showCreateStudyGroupPopup())}
                            ></button>
                            <div className="study-groups-container">
                                {Validator.isDefined(studyGroups) &&
                                    studyGroups.map((studyGroup) => <StudyGroupView group={studyGroup} />)}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p>You are currently a guest!</p>
                            <Link to="/">Log In</Link>
                        </div>
                    )}
                </div>
            </Page>
        </div>
    );
};

export default Study;
