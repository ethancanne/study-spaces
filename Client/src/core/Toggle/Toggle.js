import React from "react";

/**
 * Renders a text input.
 * @author Ethan Cannelongo
 * @date   11/20/2021
 */
const Toggle = (props) => {
  return (
    <label className="switch">
      <input type="checkbox" value={props.value} onChange={props.onChange} />
      <span className="slider"></span>
    </label>
  );
};

export default Toggle;
