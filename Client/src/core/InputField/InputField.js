import React from "react";
import "../core.scss";
/**
 * Renders an input field.
 * @author Cameron Burkholder
 * @date   10/21/2021
 */
const InputField = (props) => {
  return (
    <fieldset className="InputField" {...props}>
      {props.children}
    </fieldset>
  );
};

export default InputField;
