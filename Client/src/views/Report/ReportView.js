import "./ReportView.scss";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ResponseMessages from "../../../../Server/Responses/ResponseMessages";
import Routes from "../../../../Server/Routes/Routes";
import { sendPostRequest } from "../../../Helper";
import { closePopup } from "../../state/actions";

const ReportView = ({ type, reportData }) => {
    const [comment, setComment] = useState("");
    const dispatch = useDispatch();
    const submitReport = () => {
        sendPostRequest(
            Routes.Report.SendReport,
            { id: reportData._id, comment },
            ResponseMessages.Report.EmailSent,
            null,
            true,
            (data, error) => {
                if (error) return;
                dispatch(closePopup);
            }
        );
    };
    return (
        <div className="report-view">
            <h1>Are you sure you want to report this {type}:</h1>
            <p>{reportData.name}</p>
        </div>
    );
};

export default ReportView;
