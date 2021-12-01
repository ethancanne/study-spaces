import React, { useEffect } from 'react'
import "../core.scss";

const ColorPicker = (props) => {
    return (
        <input className="color-picker" onChange={props.onChange} type="color"/>
    )
}

export default ColorPicker
