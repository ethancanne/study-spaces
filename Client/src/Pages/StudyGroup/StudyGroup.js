import React, { useEffect, useState } from "react";
import Button from "../../core/Button/Button";
import { Link } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import Page from "../Page";
import Routes from "../../../../Server/Routes/Routes";
import { sendGetRequest, sendPostRequest } from "../../../Helper";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";

const StudyGroup = (props) => {
    const {
        match: {
            params: { id }
        }
    } = props;

    const [group, setGroup] = useState({});

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
        await sendGetRequest(
            Routes.StudyGroup.GetStudyGroup + "?studyGroupId=" + id,
            ResponseMessages.StudyGroup.SuccessStudyGroupRetrieved,
            ResponseMessages.StudyGroup.ErrorGetStudyGroup,
            true,
            (data, error) => {
                if (error) return;
                //Load study group into state
                setGroup(data.studyGroup);
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
                        <h1>{group.name}</h1>
                    </div>
                    {JSON.stringify(group)}
                </div>
            </Page>
        </div>
    );
};

export default StudyGroup;
