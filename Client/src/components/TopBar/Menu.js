import React from "react";
import "./Menu.scss";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { signOut, showSuccessNotification, showConfirmationPopup } from "../../state/actions";
import { Link } from "react-router-dom";
import { performSignOut } from "../../../Helper";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

const Menu = ({ isShowing, setIsShowing, currentPage, user }) => {
    const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
    const dispatch = useDispatch();
    const history = useHistory();
    const signOutUser = (confirmed) => {
        if (confirmed) {
            performSignOut();
            setIsShowing(false);
            history.push("/study");
        }
    };
    return (
        <>
            <div className={isShowing ? "isShowing menu" : "menu"}>
                <div className="links">
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
                    <div className="user-actions">
                        <div className="user-info">
                            <div className="name-and-school">
                                <p className="name">{user.name}</p>
                                <p className="school">{user.school}</p>
                            </div>
                            <div className="profile-pic-container">
                                <ProfilePicture image={user.profilePicture} />
                            </div>
                        </div>

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

                        <Button type={ButtonTypes.Primary} onClick={() => history.push("/account")}>
                            Account
                        </Button>
                    </div>
                ) : (
                    <Link to="/">
                        <Button type={ButtonTypes.Creation}>Log in</Button>
                    </Link>
                )}
            </div>
            <div className={isShowing ? "active background menu-background" : "background menu-background"}></div>
        </>
    );
};

export default Menu;
