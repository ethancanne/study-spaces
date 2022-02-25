import React, { useEffect } from "react";
import "../core.scss";

/**
 * Used to render dropdown menus.
 * @param {Array} props.options The items to render in the dropdown menu.
 * @param {Function} props.onChange The function to be run when an item is selected
 * @author Ethan Cannelongo
 * @date   12/05/2021
 */
const Dropdown = (props) => {
    useEffect(() => {
        console.log(props.options);
    }, []);
    return (
        <select className="dropdown" onChange={props.onChange} value={props.value}>
            {props.options.map((option) => (
                <option value={option}>{option}</option>
            ))}
        </select>
    );
};

export default Dropdown;
