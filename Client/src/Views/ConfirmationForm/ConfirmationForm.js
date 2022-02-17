import React from "react";
import { useDispatch } from "react-redux";
import Button from "../../core/Button/Button";
import "./ConfirmationForm.scss";
import ButtonTypes from "../../core/Button/ButtonTypes";
import { closePopup } from "../../state/actions";

const ConfirmationForm = ({ callback, message }) => {
    const dispatch = useDispatch();
    return (
        <div className="confirmation-container">
            <p>{message}</p>
            <div className="side-by-side">
                <Button
                    onClick={() => {
                        callback(true);
                        dispatch(closePopup());
                    }}
                    type={ButtonTypes.Destrucive}
                >
                    Yes
                </Button>
                <Button
                    onClick={() => {
                        callback(false);
                        dispatch(closePopup());
                    }}
                    type={ButtonTypes.Primary}
                >
                    No
                </Button>
            </div>
        </div>
    );
};

export default ConfirmationForm;
