import React from "react";

import ButtonTypes from "./ButtonTypes.js";

/**
* Used to render buttons. Depending on the type of button requested,
* the button displayed will vary.
* @author Cameron Burkholder
* @date   10/21/2021
*/
const Button = (props) => {
  let buttonClassName;
  switch (props.type) {
    case ButtonTypes.Primary:
      buttonClassName = "ButtonPrimary";
      break;
    case ButtonTypes.Secondary:
    default:
      buttonClassName = "ButtonSecondary";
      break;
  }

  return (
    <button>
      { props.children }
    </button>
  )
}

export default Button;
