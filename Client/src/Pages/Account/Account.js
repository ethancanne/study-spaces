import "./Account.scss";
import React from "react";
import { useSelector } from "react-redux";
import TopBar from "../../components/TopBar/TopBar";
import Page from "../Page";

/**
 * Renders the Account page
 * @author Stacey Popenfoose
 * @date   2/05/2022
 */
const Account = () => {
    const dispatch = useDispatch();
    const { user, isLoggedIn } = useSelector((state) => state.authReducer);
    return (
        <>
        <TopBar currentPage="account" />
        <Page>
            <div className="account-page">
                <div className="page-title">
                    <h1>Account</h1>
                </div>
                <Name className="user-info">
                    <h1>Name</h1>
                </Name>
                <Email className="user-info">
                    <h1>Email</h1>
                </Email>
                <AreaCode className="user-info">
                    <h1>Area Code</h1>
                </AreaCode>  
                <ProfilePicture className="user-info">
                    <h1>Profile Picture</h1>
                </ProfilePicture>
            </div>
        </Page>
        </>
    );
};

export default Account;
