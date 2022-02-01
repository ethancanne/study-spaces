import React from "react";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";

const JoinStudyGroupView = ({ group }) => {
    const { name, school, owner, subject, courseCode, isTutor, isOnline, groupColor, description, _id } = group;

    const submitJoin = () => {
        //TODO, Write route funciton
    };
    return (
        <div>
            <h1>{name}</h1>
            <p>{description}</p>
            <Button type={ButtonTypes.Creation} onClick={submitJoin}>
                Join
            </Button>
        </div>
    );
};

export default JoinStudyGroupView;
