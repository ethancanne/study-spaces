import React from "react";

import Validator from "../../../../../Server/Validator.js";

/**
* Used to allow users to input text.
* @author Cameron Burkholder
* @date   10/21/2021
*/
const TextInput = (props) => {
  const typeIsDefined = Validator.isDefined(props.type);
  const type = (typeIsDefined ? props.type : "text");

  return (
    <input className="Input" type="text" value={props.value} onChange={props.onChange} type={type}/>
  )
}

export default TextInput;
