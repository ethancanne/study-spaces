import React from "react";
import "./Menu.scss";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";

import { useSelector, useDispatch } from "react-redux";
import { signOut, showSuccessNotification } from "../../state/actions";
import { Link } from "react-router-dom";

const Menu = ({ isShowing }) => {
    const dispatch = useDispatch();
    const signOutUser = () => {
        dispatch(signOut());
        dispatch(showSuccessNotification("You have been successfully signed out."));
    };
    return (
        <>
            <div className={isShowing ? "isShowing menu" : "menu"}>
                <Button onClick={signOutUser}>Log out</Button>

                <Link to="/account" style={{ textDecoration: "none", display: "flex" }}>
                    <Button type={ButtonTypes.Primary}>Account</Button>
                </Link>
            </div>
            {/* <div className={isShowing ? "isShowing background" : "background"}></div> */}
        </>
    );
};

export default Menu;
