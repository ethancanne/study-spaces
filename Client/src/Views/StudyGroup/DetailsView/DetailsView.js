import "./DetailsView.scss";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Button from "../../../core/Button/Button";
import { showEditStudyGroupPopup, showConfirmationPopup } from "../../../state/actions";
import { sendDeleteRequest } from "../../../../Helper";
import Routes from "../../../../../Server/Routes/Routes";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages";

const DetailsView = ({ group }) => {
    const user = useSelector((state) => state.authReducer.user);
    const dispatch = useDispatch();
    const history = useHistory();

    const submitDelete = (confirmed) => {
        if (confirmed)
            sendDeleteRequest(
                Routes.StudyGroup.DeleteStudyGroup,
                { studyGroupId: group._id },
                ResponseMessages.StudyGroup.SuccessStudyGroupDeleted,
                null,
                true,
                (data, error) => {
                    if (error) return;
                    history.push("/");
                }
            );
    };
    return (
        <div className="details-container">
            <p className="details-description">{group.description}</p>

            {group.owner === user._id && <Button onClick={() => dispatch(showEditStudyGroupPopup(group))}>EDIT</Button>}

            {group.owner === user._id && (
                <Button
                    onClick={() =>
                        dispatch(
                            showConfirmationPopup(
                                submitDelete,
                                "Confirm Deletion",
                                "Are you sure you want to delete the study group: " + group.name + "?"
                            )
                        )
                    }
                >
                    Delete
                </Button>
            )}
        </div>
    );
};

export default DetailsView;
