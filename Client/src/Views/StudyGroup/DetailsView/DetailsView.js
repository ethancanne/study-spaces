import "./DetailsView.scss";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Button from "../../../core/Button/Button";
import { showEditStudyGroupPopup, showConfirmationPopup } from "../../../state/actions";
import { sendDeleteRequest } from "../../../../Helper";
import Routes from "../../../../../Server/Routes/Routes";
import ResponseMessages from "../../../../../Server/Responses/ResponseMessages";

/**
 * Renders a view for a user to view details about a joined or edit an owned study group
 * @author Ethan Cannelongo
 * @date   02/15/2022
 * @param {Object} group the study group
 * */
const DetailsView = ({ group }) => {
    const user = useSelector((state) => state.authReducer.user);
    const dispatch = useDispatch();
    const history = useHistory();

    /**
     * Makes an api call to the Delete study group route, passing in the information entered in
     * the form and rendering the client according to the response received
     * @author Ethan Cannelongo
     * @date   02/16/2022
     * @async
     * */
    const submitDelete = async (confirmed) => {
        if (confirmed)
            await sendDeleteRequest(
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