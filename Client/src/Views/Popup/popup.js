import React, { useState } from "react";
import "./Popup.scss";
import Popups from "../Popups";
import { useSelector, useDispatch } from "react-redux";
import { closePopup } from "../../state/actions";
import CreateStudyGroupView from "../Study/CreateStudyGroupView";

/**
 * This is the presentational component that presents different popup views according to the
 * view property in the popupReducer.
 * @author Ethan Cannelongo
 * @date   11/25/2021
 */
const Popup = (props) => {
  const view = useSelector((state) => state.popupReducer.view);
  const dispatch = useDispatch();
  let popupView = <></>;

  switch (view) {
    case Popups.StudyGroup.Create:
      popupView = <CreateStudyGroupView />;
      console.log("HELLo");
      break;
  }

  return (
    <div>
      <div className={"background " + (props.isShowing ? "active" : "")} onClick={() => dispatch(closePopup())}></div>
      <div className={"popup " + (props.isShowing ? "active" : "")}>
        <div className="popup-top">
          <h1>{view}</h1>
          <button onClick={() => dispatch(closePopup())}>X</button>
        </div>
        <div className="popup-body">{!props.children ? popupView : props.children}</div>
      </div>
    </div>
  );
};

export default Popup;
