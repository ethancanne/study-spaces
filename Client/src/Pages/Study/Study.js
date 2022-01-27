import "./Study.scss";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut, showStudyGroupPopup, addStudyGroup } from "../../state/actions";
import Validator from "../../../../Server/Validator";
import Routes from "../../../../Server/Routes/Routes";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";

import Button from "../../core/Button/Button.js";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";

import TopBar from "../../components/TopBar/TopBar";
import StudyGroupView from "../../Views/Study/studyGroupView/StudyGroupView";

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
            console.log(e);
        } finally {
            const responseIsDefined = Validator.isDefined(response);

            if (responseIsDefined) {
                const studyGroupCreationWasValid =
                    ResponseMessages.StudyGroup.SuccessStudyGroupsRetrieved === response.data.message;

                if (studyGroupCreationWasValid) {
                    const studyGroups = response.data.studyGroups;
                    console.log(studyGroups);
                    if (studyGroups) {
                        studyGroups.map((s) => {
                            dispatch(addStudyGroup(s, true));
                        });
                    }
                } else {
                    console.log("That didn't work");
                }
            } else {
                console.log("That didn't work");
            }
        }
    };

    return (
        <div>
            <TopBar currentPage="study" />
            <div className="study">
                <h1 className="page-title">Study</h1>
                {isLoggedIn ? (
                    <div>
                        <Button onClick={() => dispatch(signOut())}>Log out</Button>
                        <button className="add-button" onClick={() => dispatch(showStudyGroupPopup())}></button>
                        <div className="study-groups-container">
                            {Validator.isDefined(studyGroups) &&
                                studyGroups.map((studyGroup) => <StudyGroupView title={studyGroup.name} />)}
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>You are currently a guest!</p>
                        <Link to="/">Log In</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Study;
