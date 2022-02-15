import React, { useEffect } from "react";
import "../core.scss";

const ColorPicker = (props) => {
    return <input className="color-picker" onChange={props.onChange} type="color" value={props.value} />;
};

export default ColorPicker;
