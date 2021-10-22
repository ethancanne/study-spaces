import React from "react";

/**
* Used to render forms.
* @author Cameron Burkholder
* @date   10/21/2021
*/
const Form = (props) => {
  return (
    <form className="Form">
      { props.children }
    </form>
  )
}

export default Form;
