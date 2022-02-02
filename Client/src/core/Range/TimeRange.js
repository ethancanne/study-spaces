import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const TimeRange = ({ updateTimeRange }) => {
    const [values, setValues] = React.useState([0, 1440]);

    function valuetext(value) {
        console.log(value);
    }

    const handleChange = (event, newNum) => {
        //Convert minutes to 24 hr time
        var hours = newNum[0] / 60;
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);

        var hours2 = newNum[1] / 60;
        var rhours2 = Math.floor(hours2);
        var minutes2 = (hours2 - rhours2) * 60;
        var rminutes2 = Math.round(minutes2);

        //Add a zero if needed
        if (rminutes < 10) rminutes = rminutes + "0";
        if (rminutes2 < 10) rminutes2 = rminutes2 + "0";

        //Convert to 12 hour
        var AmOrPm1 = rhours >= 12 ? "PM" : "AM";
        var AmOrPm2 = rhours2 >= 12 ? "PM" : "AM";

        rhours = rhours % 12 || 12;
        rhours2 = rhours2 % 12 || 12;

        //Format time into a string
        var time1 = rhours + ":" + rminutes + AmOrPm1;

        var time2 = rhours2 + ":" + rminutes2 + AmOrPm2;

        //Update the time range with the string
        if (time2 === "12:00PM") {
          time2 = "11:45PM";
        }
        updateTimeRange([time1, time2]);
        setValues(newNum);
    };
    return (
        <Box sx={{ width: "100%", height: "90px", overflow: "hidden" }}>
            <Slider
                sx={{ height: "40px", color: "rgba(139, 79, 11, 0.616)" }}
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
