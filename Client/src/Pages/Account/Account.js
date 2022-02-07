import "./Account.scss";
import React from "react";
import { useSelector } from "react-redux";
import TopBar from "../../components/TopBar/TopBar";
import Page from "../Page";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";

/**
 * Renders the Account page
 * @author Stacey Popenfoose
 * @date   2/05/2022
 */
const Account = () => {
    // const dispatch = useDispatch();
    const { user, isLoggedIn } = useSelector((state) => state.authReducer);

    const deleteAccount = async ()=>{
        response = await axios.delete(Routes.Account.Delete);

    }
    return (
        <>
        <TopBar currentPage="account" />
        <Page>
            <div className="account-page">

                <div className="page-title">
                    <h1>Account</h1>
                </div>
                <div className="user-info">
                    <p className="name">{user.name}</p>
                </div>
                <div className="user-info">
                    <p className="email">{user.email}</p>
                </div>
                <div className="user-info">
                    <p className="areaCode">{user.areaCode}</p>>
                </div>  
                <div className="user-info">
                    <img
                                className="profile-picture"
                                src={" data:image/png;charset=utf-8;base64," + user.profilePicture}
                                alt=""
                            />
                </div>
                <Button>Change Email</Button>
                <Button>Change Password</Button>

            </div>
        </Page>
        </>
    );
};

export default Account;
