import React, { useEffect } from "react";
import Button from "../../core/Button/Button";
import { Link } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import Page from "../Page";
import Routes from "../../../../Server/Routes/Routes";
import { sendGetRequest } from "../../../Helper";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";

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
        sendGetRequest(
            Routes.StudyGroup.GetStudyGroup,
            ResponseMessages.StudyGroup.SuccessStudyGroupsRetrieved,
            "There was an error retriving your study group",
            true,
            (data, error) => {
                if (error) return;
                //Load study group into state
            }
        );
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
