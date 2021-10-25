import React from "react";

/**
* Renders an input field.
* @author Cameron Burkholder
* @date   10/21/2021
*/
const InputField = (props) => {
  return (
    <fieldset className="InputField" {...props}>
      { props.children }
    </fieldset>
  )
}

export default InputField;
