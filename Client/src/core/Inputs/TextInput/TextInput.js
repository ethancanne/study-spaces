import React from "react";

import Validator from "../../../../../Server/Validator.js";

/**
 * Renders a text input.
 * @author Cameron Burkholder
 * @date   10/21/2021
 */
const TextInput = (props) => {
    const typeIsDefined = Validator.isDefined(props.type);
    const type = typeIsDefined ? props.type : "text";

    return (
        <>
            {props.isTextArea ? (
                <textarea className="Input" value={props.value} onChange={props.onChange} type={type} {...props} />
            ) : (
                <input className="Input" value={props.value} onChange={props.onChange} type={type} {...props} />
            )}
        </>
    );
};

export default TextInput;
