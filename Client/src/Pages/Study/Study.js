import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut, showStudyGroupPopup } from "../../state/actions";

import Button from "../../core/Button/Button.js";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

import "./Study.scss";

const Study = () => {
  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
  const user = useSelector((state) => state.authReducer.user);
  const dispatch = useDispatch();

  return (
    <div className="study">
      {isLoggedIn ? (
        <div>
          <p>Welcome {user.name}, you are logged in!</p>
          <Button onClick={() => dispatch(signOut())}>Log out</Button>
          <button className="add-button" onClick={() => dispatch(showStudyGroupPopup())}>
            +
          </button>
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
