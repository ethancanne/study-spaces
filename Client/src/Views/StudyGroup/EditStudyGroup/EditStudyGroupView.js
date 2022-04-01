import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { addStudyGroup, closePopup } from "../../../state/actions/index";
import { sendPostRequest } from "../../../../Helper";

import ResponseMessages from "../../../../../Server/Responses/ResponseMessages";
import Routes from "../../../../../Server/Routes/Routes";

import CreateStudyGroupForm from "../../../components/CreateStudyGroupForm/CreateStudyGroupForm";

/**
 * This is a specific view that is used in a popup to allow a user to edit a study group
 * @author Ethan Cannelongo
 * @date   02/14/2022
 */
const EditStudyGroupView = ({ group }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [name, setName] = useState(group.name);
    const [description, setDescription] = useState(group.description);
    const [subject, setSubject] = useState(group.subject);
    const [privacy, setPrivacy] = useState(group.privacySetting);
    const [courseCode, setCourseCode] = useState(group.course);
    const [isTutorGroup, setIsTutorGroup] = useState(group.isTutorGroup);
    const [isOnlineGroup, setIsOnlineGroup] = useState(group.isOnlineGroup);
    const [groupColor, setGroupColor] = useState(group.groupColor);

    /**
     * Makes an api call to the Edit study group route, passing in the information entered in the form and rendering the client according to the response received
     * @author Ethan Cannelongo
     * @date   02/14/2022
     * @async
     * */
    const submitEditStudyGroup = async (event) => {
        //Prevent default form behavior

        event.preventDefault();
        event.stopPropagation();

        await sendPostRequest(
            Routes.StudyGroup.EditStudyGroup,
            {
                studyGroupId: group._id,
                name,
                groupColor,
                description,
                subject,
                privacySetting: privacy,
                course: courseCode,
                isTutorGroup,
                isOnlineGroup
            },
            ResponseMessages.StudyGroup.SuccessStudyGroupEdited,
            null,
            true,
            (data, error) => {
                if (error) return;
                history.go(0);
                dispatch(closePopup());
            }
        );
    };

    /**
     * Used to update the name field in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/14/2022
     */
    const updateNameField = (event) => {
        setName(event.target.value);
    };

    /**
     * Used to update the group color field in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/14/2022
     */
    const updateGroupColor = (event) => {
        setGroupColor(event.target.value);
    };

    /**
     * Used to update the description field in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/14/2022
     */
    const updateDescriptionField = (event) => {
        setDescription(event.target.value);
    };

    /**
     * Used to update the subject field in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/14/2022
     */
    const updateSubjectField = (event) => {
        setSubject(event.target.options[event.target.selectedIndex].value);
    };

    /**
     * Used to update the privacy field in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/14/2022
     */
    const updatePrivacy = (event) => {
        setPrivacy(event.target.options[event.target.selectedIndex].value);
    };

    /**
     * Used to update the course code field in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/14/2022
     */
    const updateCourseCodeField = (event) => {
        setCourseCode(event.target.value);
    };

    /**
     * Used to update the is online group switch value in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/14/2022
     */
    const updateIsOnlineGroup = (event) => {
        setIsOnlineGroup(event.target.checked);
    };

    /**
     * Used to update the is tutor group switch value in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/14/2022
     */
    const updateIsTutorGroup = (event) => {
        setIsTutorGroup(event.target.checked);
    };

    return (
        <div className="edit-studygroup-view">
            {console.log("GROUP::::::::::", group)}
            <CreateStudyGroupForm
                submitCreateStudyGroup={submitEditStudyGroup}
                name={name}
                description={description}
                subject={subject}
                privacy={privacy}
                courseCode={courseCode}
                isTutorGroup={isTutorGroup}
                isOnlineGroup={isOnlineGroup}
                groupColor={groupColor}
                updateNameField={updateNameField}
                updateDescriptionField={updateDescriptionField}
                updateSubjectField={updateSubjectField}
                updatePrivacy={updatePrivacy}
                updateCourseCodeField={updateCourseCodeField}
                updateIsTutorGroup={updateIsTutorGroup}
                updateIsOnlineGroup={updateIsOnlineGroup}
                updateGroupColor={updateGroupColor}
                userSchool={null}
            />
        </div>
    );
};

export default EditStudyGroupView;

const submitData = () => {};
