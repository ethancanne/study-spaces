import "./ReportView.scss";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";
import Routes from "../../../../Server/Routes/Routes";
import { sendPostRequest } from "../../../Helper";
import { closePopup } from "../../state/actions";
import Form from "../../core/Form/Form";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";
import InputField from "../../core/InputField/InputField";
import TextInput from "../../core/Inputs/TextInput/TextInput";
import Label from "../../core/Label/Label";

const ReportView = ({ type, reportData }) => {
    const [comment, setComment] = useState("");
    const dispatch = useDispatch();

    const submitReport = (e) => {
        e.preventDefault();
        e.stopPropagation();

        sendPostRequest(
            Routes.Report.SendReport,
            { id: reportData._id, comment, reportType: type },
            ResponseMessages.Report.EmailSent,
            null,
            true,
            (data, error) => {
                if (error) return;
                dispatch(closePopup());
            }
        );
    };
    return (
        <div className="report-view">
            <h1>Please add a comment for the reason you are reporting this {type}</h1>
            <Form onSubmit={submitReport}>
                <InputField>
                    <Label>Comments:</Label>
                    <TextInput onChange={(e) => setComment(e.target.value)} value={comment} isTextArea={true} />
                </InputField>

                <Button type={ButtonTypes.Creation}>Done</Button>
            </Form>
        </div>
    );
};

export default ReportView;
