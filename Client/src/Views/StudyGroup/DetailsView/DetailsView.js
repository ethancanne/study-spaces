import "./DetailsView.scss";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../../core/Button/Button";
import { showEditStudyGroupPopup } from "../../../state/actions";

const DetailsView = ({ group }) => {
    const user = useSelector((state) => state.authReducer.user);
    const dispatch = useDispatch();

    return (
        <div className="details-container">
            <p>{group.description}</p>
            {group.owner === user._id && <Button onClick={() => dispatch(showEditStudyGroupPopup(group))}>EDIT</Button>}
        </div>
    );
};

export default DetailsView;
