import React from "react";

/**
* Used to render a label next to an input.
* @author Cameron Burkholder
* @date   10/21/2021
*/
const Label = (props) => {
  return (
    <label className="Label">
      { props.children }
    </label>
  )
}

export default Label;
