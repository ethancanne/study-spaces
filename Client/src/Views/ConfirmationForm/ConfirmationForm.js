import React from "react";
import { useDispatch } from "react-redux";
import Button from "../../core/Button/Button";
import "./ConfirmationForm.scss";
import ButtonTypes from "../../core/Button/ButtonTypes";
import { closePopup } from "../../state/actions";

const ConfirmationForm = ({ callback, message, isConfirmation, firstButtonTitle, secondButtonTitle }) => {
    const dispatch = useDispatch();
    return (
        <div className="confirmation-container">
            <p>{message}</p>
            <div className="side-by-side">
                <Button
                    onClick={() => {
                        dispatch(closePopup());
                        callback(true);
                    }}
                    type={isConfirmation ? ButtonTypes.Destrucive : ButtonTypes.Primary}
                >
                    {firstButtonTitle || "Yes"}
                </Button>
                <Button
                    onClick={() => {
                        dispatch(closePopup());
                        callback(false);
                    }}
                    type={ButtonTypes.Primary}
                >
                    {secondButtonTitle || "No"}
                </Button>
            </div>
        </div>
    );
};

export default ConfirmationForm;
