import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../state/actions";

import Button from "../core/Button/Button.js";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

const Study = () => {
  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
  const user = useSelector((state) => state.authReducer.user);
  const dispatch = useDispatch();

  return (
    <>
      {isLoggedIn ? (
        <div>
          <p>Welcome {user.name}, you are logged in!</p>
          <Button onClick={() => dispatch(signOut())}>Log out</Button>
        </div>
      ) : (
        <div>
          <p>You are currently a guest!</p>
          <Link to="/">Log In</Link>
        </div>
      )}
    </>
  );
};

export default Study;
