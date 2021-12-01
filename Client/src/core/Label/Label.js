import React from "react";

/**
 * Renders a label.
 * @author Cameron Burkholder
 * @date   10/21/2021
 */
const Label = (props) => {
    return (
        <label className="Label" {...props}>
            {props.children}
        </label>
    );
};

export default Label;
