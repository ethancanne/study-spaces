import React from "react";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";
import Label from "../../core/Label/Label";


const JoinStudyGroupView = ({ group }) => {
    const { name, school, owner, subject, courseCode, isTutor, isOnline, groupColor, description, _id } = group;

    const submitJoin = () => {
        //TODO, Write route funciton
    };
    return (
        <div>
            <h1>{name}</h1>
            <div className="info">
                <Label>Description</Label>
                <p>{description}</p>
            </div>
            <div className="info">
                <Label>Owner</Label>
                <p>{owner}</p>
            </div>
            <div className="info">
                <Label>Course Code</Label>
                <p>{courseCode}</p>
            </div>
            <div className="info">
                <Label>Subject</Label>
                <p>{subject}</p>
            </div>
            <div className="info">
                <Label>Associated With</Label>
                <p>{school}</p>
            </div>
            <Button type={ButtonTypes.Creation} onClick={submitJoin}>
                Join
            </Button>
        </div>
    );
};

export default JoinStudyGroupView;
