import "./TopBar.scss";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";

import Menu from "./Menu";
const TopBar = ({ currentPage }) => {
    const dispatch = useDispatch();
    const { user, isLoggedIn } = useSelector((state) => state.authReducer);
    // const { name, profilePicture } = user;
    const [menuIsShowing, setMenuIsShowing] = useState(false);

    return (
        <>
            <div className="top-bar">
                <div className="wrapper">
                    <div className="left">
                        <h1>Study Spaces</h1>
                        <Link to="/study" className={currentPage === "study" ? "active nav-item" : "nav-item"}>
                            <p>Study</p>
                        </Link>
                        <Link to="/search" className={currentPage === "search" ? "active nav-item" : "nav-item"}>
                            <p>Search</p>
                        </Link>
                        <Link to="/message" className={currentPage === "message" ? "active nav-item" : "nav-item"}>
                            <p>Message</p>
                        </Link>
                    </div>
                    {isLoggedIn ? (
                        <div
                            className="right"
                            onClick={() => {
                                setMenuIsShowing(!menuIsShowing);
                                console.log(menuIsShowing);
                            }}
                        >
                            <p className="school">Liberty University</p>
                            <p className="name">{user.name}</p>
                            <img
                                className="profile-picture"
                                src={" data:image/png;charset=utf-8;base64," + user.profilePicture}
                                alt=""
                            />
                        </div>
                    ) : (
                        <Link to="/">
                            <Button type={ButtonTypes.Creation}>Log in</Button>
                        </Link>
                    )}
                </div>
            </div>
            <div className="border">
                <Menu isShowing={menuIsShowing} />
            </div>
        </>
    );
};

export default TopBar;
