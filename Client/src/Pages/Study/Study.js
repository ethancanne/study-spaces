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
const Study = () => {
    const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
    const user = useSelector((state) => state.authReducer.user);
    const studyGroups = useSelector((state) => state.studyGroupsReducer.studyGroups);

    const dispatch = useDispatch();

    useEffect(() => {
        async function getGroups() {
            await getStudyGroups();
        }
        getGroups();
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
