import React, { useEffect } from "react";
import Button from "../../core/Button/Button";
import { Link } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import Page from "../Page";
import Routes from "../../../../Server/Routes/Routes";

const StudyGroup = (props) => {
    const {
        group,
        match: {
            params: { id }
        }
    } = props;

    useEffect(() => {
        async function getGroups() {
            await getStudyGroup();
        }
        getGroups();
    }, []);

    /**
     * Retrieves all study groups the user is a member of from the server
     * @author Ethan Cannelongo
     * @date   11/20/2021
     */
    const getStudyGroup = async () => {
        let response;
        try {
            axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
            response = await axios.get(Routes.StudyGroup.GetStudyGroup, {
                id
            });
        } catch (e) {
            dispatch(
                showErrorNotification(
                    "There's been an error loading your study group.  Please try again later. " + e.message
                )
            );
        } finally {
            const responseIsDefined = Validator.isDefined(response);

            if (responseIsDefined) {
                const studyGroupCreationWasValid =
                    ResponseMessages.StudyGroup.SuccessStudyGroupRetrieved === response.data.message;

                if (studyGroupCreationWasValid) {
                    //Load study group into state
                } else {
                    dispatch(
                        showErrorNotification(
                            "There's been an error loading your study group.  Please try again later."
                        )
                    );
                }
            } else {
                dispatch(
                    showErrorNotification("There's been an error loading your study group.  Please try again later.")
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
                        <Link to="/">
                            <Button>{"<"}</Button>
                        </Link>
                        <h1>{id}</h1>
                    </div>
                </div>
            </Page>
        </div>
    );
};

export default StudyGroup;
