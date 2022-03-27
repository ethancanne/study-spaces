import React from "react";
import "./SideView.scss";

const SideView = (props) => {
    return (
        <div
            className={
                props.sideViewIsShowing ? props.nameOfClass + " side-view showing" : props.nameOfClass + " side-view"
            }
        >
            <button
                className="close-side-view-btn"
                onClick={() => {
                    props.setSideViewIsShowing(false);
                }}
            >
                X
            </button>
            {props.children}
        </div>
    );
};

export default SideView;
