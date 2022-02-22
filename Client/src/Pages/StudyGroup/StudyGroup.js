import "./StudyGroup.scss";
import React, { useEffect, useState } from "react";
import Button from "../../core/Button/Button";
import { Link } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import Page from "../Page";
import MembersView from "../../Views/StudyGroup/Members/MembersView";
import DetailsView from "../../Views/StudyGroup/DetailsView/DetailsView";
import Routes from "../../../../Server/Routes/Routes";
import { sendGetRequest, sendPostRequest } from "../../../Helper";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";
import { useDispatch, useSelector } from "react-redux";
import { showEditStudyGroupPopup } from "../../state/actions";
import FeedView from "../../Views/StudyGroup/Feed/FeedView";
import Loading from "../../components/Loading/Loading";

const StudyGroup = (props) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.authReducer.user);
    const isLoading = useSelector((state) => state.notificationReducer.loading);

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
        console.log(group);
    }, []);

    /**
     * Retrieves the study group associated with the id from the url
     * @author Ethan Cannelongo
     * @date 02/10/2022
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
            },
            false
        );
    };
    return (
        <div>
            <Page topBar={true} currentPage="study" color={group.groupColor}>
                <div className="study-group-page">
                    <div className="page-title">
                        <Link to="/">
                            <Button style={{ marginLeft: "0px" }}>{"<"}</Button>
                        </Link>
                        <h1>{group.name}</h1>
                    </div>

                    <div className="main-view">
                        {isLoading ? (
                            <Loading />
                        ) : (
                            <>
                                <MembersView group={group} />
                                <FeedView group={group} />
                                <DetailsView group={group} />
                            </>
                        )}
                    </div>
                </div>
            </Page>
        </div>
    );
};

export default StudyGroup;
