import React, { useEffect } from 'react'
import "../core.scss";

const Dropdown = (props) => {
    useEffect(() => {
        console.log(props.options)
    }, [])
    return (
        <select className="dropdown" onChange={props.onChange}>
            {props.options.map(option=>(
                <option value={option}>{option}</option>
            ))}
        </select>
    )
}

export default Dropdown
