import React from "react";
import "./AuthView.scss";

const AuthView = (props) => {
    return (
        <div className="auth-view">
            <h1>Study Spaces</h1>
            {props.children}
            <p className="error-message">{props.errMsg}</p>
        </div>
    );
};

export default AuthView;
