import React from "react";
import "./Menu.scss";
import Button from "../../core/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { signOut, showSuccessNotification } from "../../state/actions";

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
            </div>
            {/* <div className={isShowing ? "isShowing background" : "background"}></div> */}
        </>
    );
};

export default Menu;
