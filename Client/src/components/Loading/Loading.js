import "./Loading.scss";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loading = () => {
    return (
        <div className="loading">
            <Box sx={{ overflow: "hidden" }}>
                <CircularProgress sx={{ color: "#d4aa8c" }} />
            </Box>
        </div>
    );
};

export default Loading;
