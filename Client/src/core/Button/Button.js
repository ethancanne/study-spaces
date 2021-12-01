import React from "react";
import "../core.scss";

import ButtonTypes from "./ButtonTypes.js";

/**
 * Used to render buttons. Depending on the type of button requested,
 * the button displayed will vary.
 * @param {string} props.type The type of button to render.
 * @author Cameron Burkholder
 * @date   10/21/2021
 */
const Button = (props) => {
    let buttonClassName;
    switch (props.type) {
        case ButtonTypes.Primary:
            buttonClassName = "ButtonPrimary";
            break;
        case ButtonTypes.Creation:
            buttonClassName = "ButtonCreation";
            break;
        case ButtonTypes.Destructive:
            buttonClassName = "ButtonDestructive";
            break;
        default:
            buttonClassName = "ButtonPrimary";
            break;
    }

    return (
        <button className={buttonClassName + " Button"} {...props}>
            {props.children}
        </button>
    );
};

export default Button;
