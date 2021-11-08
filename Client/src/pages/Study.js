import React from 'react';

import Button from '../core/Button/Button.js';

const Study = ({clientSideLogout, isLoggedIn, user}) => {
  return (
    <>
      {isLoggedIn ? (
        <div>
          <p>Welcome {user.name}, you are logged in!</p>
          <Button onClick={clientSideLogout}>Log out</Button>
        </div>
      ) : (
        <p>You are currently a guest!</p>
      )}
    </>
  );
};

export default Study;
