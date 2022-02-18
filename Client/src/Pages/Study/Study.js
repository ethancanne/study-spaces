import "./Study.scss";
import React, { useEffect } from "react";
import { sendGetRequest, sendPostRequest } from "../../../Helper";
import { useSelector, useDispatch } from "react-redux";
import {
    signOut,
    showCreateStudyGroupPopup,
    loadStudyGroup,
    showErrorNotification,
    setUser
} from "../../state/actions";
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
            await verifyEmail(props.match.params.verificationToken);
        }
        if (props.isVerifyingEmail) verifyUserEmail();
    }, []);

    /**
     * Retrieves all study groups the user is a member of from the server
     * @author Ethan Cannelongo
     * @date   11/20/2021
     */
    const getStudyGroups = async () => {
        await sendGetRequest(
            Routes.StudyGroup.GetUserStudyGroups,
            ResponseMessages.StudyGroup.SuccessStudyGroupsRetrieved,
            "There's been an error loading your study groups.  Please try again later. ",
            true,
            (data, error) => {
                if (error) {
                    console.log(error);
                }
                const { studyGroups } = data;
                if (studyGroups) {
                    studyGroups.map((s) => {
                        dispatch(loadStudyGroup(studyGroups));
                    });
                }
            }
        );
    };

    /**
     * Used to verify the email, if a user changed their email, from a
     * token that was received from the link
     * @author Ethan Cannelongo
     * @param {String} verificationToken The verification token
     * @date   02/09/22
     * @async
     */
    const verifyEmail = async (verificationToken) => {
        // SUBMIT THE VERIFY USER REQUEST.
        await sendPostRequest(
            Routes.Account.VerifyEmailChange,
            { verificationToken },
            ResponseMessages.Account.SuccessChangingEmail,
            null,
            false,
            (data, error) => {
                if (error) return;
                dispatch(setUser(data.user));
            }
        );
    };

    return (
        <div>
            <Page topBar={true} currentPage="study">
                <div className="study-page">
                    <div className="page-title">
                        <h1>Study</h1>
                    </div>
                    {isLoggedIn ? (
                        <div>
                            <Button
                                className="add-button"
                                onClick={() => dispatch(showCreateStudyGroupPopup())}
                            ></Button>
                            <div className="study-groups-container">
                                {Validator.isDefined(studyGroups) &&
                                    studyGroups.map((studyGroup) => <StudyGroupView group={studyGroup} />)}
                            </div>
                        </div>
                    ) : (
                        <div className="guest-message">
                            <h1>You are currently browsing Study Spaces as a guest!</h1>
                            <p>Please sign-up or log-in to be able to join and create study groups</p>
                            <p>Feel free to use our search tool to discover study groups in your area.</p>
                        </div>
                    )}
                </div>
            </Page>
        </div>
    );
};

export default Study;
