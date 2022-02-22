import React from "react";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading/Loading";
import "./AuthView.scss";

const AuthView = (props) => {
    const isLoading = useSelector((state) => state.notificationReducer.loading);
    return (
        <div className="auth-view">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <h1>Study Spaces</h1>
                    {props.children}
                    <p className="error-message">{props.errMsg}</p>
                </>
            )}
        </div>
    );
};

export default AuthView;
