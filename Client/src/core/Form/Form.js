import React from "react";

/**
 * Renders a form.
 * @author Cameron Burkholder
 * @date   10/21/2021
 */
const Form = (props) => {
    return (
        <form className="Form" {...props}>
            {props.children}
        </form>
    );
};

export default Form;
