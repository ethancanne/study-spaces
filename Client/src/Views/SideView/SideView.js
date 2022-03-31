import React from "react";
import "./SideView.scss";

const SideView = (props) => {
    const direction = props.direction || "left";
    return (
        <div
            className={
                props.sideViewIsShowing
                    ? props.nameOfClass + " " + direction + " side-view showing"
                    : props.nameOfClass + " " + direction + " side-view"
            }
        >
            {console.log(direction)}
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
