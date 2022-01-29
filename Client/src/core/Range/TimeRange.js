import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const TimeRange = ({ updateTimeRange }) => {
    const [values, setValues] = React.useState([0, 1440]);

    function valuetext(value) {
        console.log(value);
    }

    const handleChange = (event, newNum) => {
        var hours = newNum[0] / 60;
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);

        var hours2 = newNum[1] / 60;
        var rhours2 = Math.floor(hours2);
        var minutes2 = (hours2 - rhours2) * 60;
        var rminutes2 = Math.round(minutes2);

        if (rhours <= 10) rhours = "0" + rhours;
        if (rhours2 <= 10) rhours2 = "0" + rhours2;

        if (rminutes <= 10) rminutes = rminutes + "0";
        if (rminutes2 <= 10) rminutes2 = rminutes2 + "0";

        updateTimeRange([rhours + ":" + rminutes, rhours2 + ":" + rminutes2]);
        setValues(newNum);
    };
    return (
        <Box sx={{ width: "100%", height: "100px" }}>
            <Slider
                sx={{ height: "60px", color: "rgba(139, 79, 11, 0.616)" }}
                value={values}
                onChange={handleChange}
                step={15}
                min={0}
                max={1440}
            />
        </Box>
    );
};

export default TimeRange;
