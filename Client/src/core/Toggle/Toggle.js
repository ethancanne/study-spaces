import React from "react";

/**
 * Renders a toggle switch.
 * @author Ethan Cannelongo
 * @date   11/20/2021
 */
const Toggle = (props) => {
    return (
        <label className="Toggle">
            {console.log(props.value)}
            <input
                type="checkbox"
                checked={props.value ? "checked" : ""}
                value={props.value}
                onChange={props.onChange}
            />
            <span className="slider"></span>
        </label>
    );
};

export default Toggle;
