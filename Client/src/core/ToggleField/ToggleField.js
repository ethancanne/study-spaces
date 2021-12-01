import React from "react";
import "../core.scss";
/**
 * Renders an toggle field.
 * @author Cameron Burkholder
 * @date   10/21/2021
 */
const ToggleField = (props) => {
    return (
        <div className="ToggleField" {...props}>
            {props.children}
        </div>
    );
};

export default ToggleField;
