import React from "react";
import "./Menu.scss";
import Button from "../../core/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../../state/actions";

const Menu = ({ isShowing }) => {
    const dispatch = useDispatch();
    return (
        <>
            <div className={isShowing ? "isShowing menu" : "menu"}>
                <Button onClick={() => dispatch(signOut())}>Log out</Button>
            </div>
            {/* <div className={isShowing ? "isShowing background" : "background"}></div> */}
        </>
    );
};

export default Menu;
