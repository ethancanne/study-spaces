import React from "react";

/**
* Used to render an input field.
* @author Cameron Burkholder
* @date   10/21/2021
*/
const InputField = (props) => {
  return (
    <fieldset className="InputField">
      { props.children }
    </fieldset>
  )
}

export default InputField;
