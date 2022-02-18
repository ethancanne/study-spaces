import React from "react";
import "./Menu.scss";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";

import { useSelector, useDispatch } from "react-redux";
import { signOut, showSuccessNotification, showConfirmationPopup } from "../../state/actions";
import { Link } from "react-router-dom";

const Menu = ({ isShowing, setIsShowing }) => {
    const dispatch = useDispatch();
    const signOutUser = (confirmed) => {
        if (confirmed) {
            dispatch(signOut());
            dispatch(showSuccessNotification("You have been successfully signed out."));
            setIsShowing(false);
        }
    };
    return (
        <>
            <div className={isShowing ? "isShowing menu" : "menu"}>
                <Button
                    onClick={() =>
                        dispatch(
                            showConfirmationPopup(
                                signOutUser,
                                "Confirm Sign Out",
                                "Are you sure you want to sign out of Study Spaces?  You will be missed."
                            )
                        )
                    }
                >
                    Log out
                </Button>

                <Link to="/account" style={{ textDecoration: "none", display: "flex" }}>
                    <Button type={ButtonTypes.Primary}>Account</Button>
                </Link>
            </div>
            {/* <div className={isShowing ? "isShowing background" : "background"}></div> */}
        </>
    );
};

export default Menu;
