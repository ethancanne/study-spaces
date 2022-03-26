import "./TopBar.scss";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

import Menu from "./Menu";
const TopBar = ({ currentPage, color }) => {
    const { user, isLoggedIn } = useSelector((state) => state.authReducer);
    const [menuIsShowing, setMenuIsShowing] = useState(false);

    return (
        <>
            <div className="top-bar">
                <div className="wrapper" style={{ borderColor: color }}>
                    <div className="left">
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <h1>Study Spaces</h1>
                        </Link>
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
                            <div className="userInfoContainer">
                                <p className="school">{user.school}</p>
                                <p className="name">{user.name}</p>
                                <ProfilePicture image={user.profilePicture} />
                            </div>

                            <div
                                className={"hamburger" + " " + (menuIsShowing && "activeHamburger")}
                                onClick={() => {
                                    setMenuIsShowing(!menuIsShowing);
                                }}
                            >
                                <span className="line1"></span>
                                <span className="line2"></span>
                                <span className="line3"></span>
                            </div>
                        </div>
                    ) : (
                        <Link to="/">
                            <Button type={ButtonTypes.Creation}>Log in</Button>
                        </Link>
                    )}
                </div>
            </div>

            <Menu isShowing={menuIsShowing} setIsShowing={setMenuIsShowing} currentPage={currentPage} user={user} />
        </>
    );
};

export default TopBar;
