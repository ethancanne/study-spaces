import React from "react";
import "./SideView.scss";

//When a user is using Study Spaces on a mobile device, the SideView will be used to help them navigate through the app and to access the app's features.  It hides off the screen until an action is taken that requires it slide into view.  That action is triggered by the user clicking on a button in the app, making props.sideViewIsShowing = true.  The SideView will slide into view and display the content of the children of the side view.  The SideView will slide out of view when the user clicks on an X button in the side view.
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
