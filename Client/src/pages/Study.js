import React from 'react'

// PAGES.
// import Page from "./Page.js";''

const Study = ({isLoggedIn, user}) => {
    return (
        <>
            { isLoggedIn ? (
                <p>Welcome {user.name}, you are logged in!</p>
            ) : (
                <p>You are currently a guest!</p>
            )}
        </>
    )
    
}

export default Study; 
