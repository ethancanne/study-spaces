import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut, showStudyGroupPopup } from "../../state/actions";

import Button from "../../core/Button/Button.js";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

import "./Study.scss";
import StudyGroupView from "../../Views/Study/studyGroupView/StudyGroupView";

const Study = () => {
  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
  const user = useSelector((state) => state.authReducer.user);
  const studyGroups = useSelector((state) => state.studyGroupsReducer.studyGroups);

  const dispatch = useDispatch();

  return (
    <div className="study">
      {isLoggedIn ? (
        <div>
          <p>Welcome {user.name}, you are logged in!</p>
          <Button onClick={() => dispatch(signOut())}>Log out</Button>
          <button className="add-button" onClick={() => dispatch(showStudyGroupPopup())}></button>
          <div className="study-groups-container">
            {studyGroups.map((studyGroup) => (
              <StudyGroupView title={studyGroup.title} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p>You are currently a guest!</p>
          <Link to="/">Log In</Link>
        </div>
      )}
    </div>
  );
};

export default Study;
