import React, { useState } from "react";
import Views from "../Views";
import "./popup.scss";
import Popups from "../Popups";
import { useSelector, useDispatch } from "react-redux";
import { closePopup } from "../../state/actions";
import CreateStudyGroupView from "../Study/CreateStudyGroupView";

const Popup = (props) => {
  const [view, setPopupView] = useState(props.popupView ? props.popupView : "");
  const dispatch = useDispatch();
  let popupView = <></>;

  switch (view) {
    case Popups.StudyGroup.Create:
      popupView = <CreateStudyGroupView setPopupView={setPopupView} />;
      console.log(view);
      break;
  }

  return (
    <div>
      <div className="background"></div>

      <div className="popup">
        <div className="popup-top">
          <button onClick={() => dispatch(closePopup())}>X</button>
        </div>
        {!props.children ? popupView : props.children}
      </div>
    </div>
  );
};

export default Popup;
