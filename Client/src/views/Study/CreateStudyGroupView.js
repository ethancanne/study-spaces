import React, { useState } from "react";
import CreateStudyGroupForm from "../../components/CreateStudyGroupForm/CreateStudyGroupForm";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addStudyGroup } from "../../state/actions/index";
import { closePopup } from "../../state/actions";

// are these needed?
import ResponseMessages from "../../../../Server/Responses/ResponseMessages.js";
import Validator from "../../../../Server/Validator";
import Routes from "../../../../Server/Routes/Routes";

/**
 * This is a specific view that is used in a popup to allow a user to create a study group
 * @author Ethan Cannelongo
 * @date   11/20/2021
 */
const CreateStudyGroupView = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.authReducer.user);

    const BLANK = "";
    const [name, setName] = useState(BLANK); //TextInput tag
    const [description, setDescription] = useState(BLANK); //TextInput tag
    const [subject, setSubject] = useState("That"); //select tag, filled with option tags
    const [privacy, setPrivacy] = useState("Public"); //select tag, filled with option tags
    const [courseCode, setCourseCode] = useState(BLANK); //TextInput tag
    const [isAssociatedWithSchool, setIsAssociatedWithSchool] = useState(false); //Input tag with type "checkbox"
    const [isTutorGroup, setIsTutorGroup] = useState(false); //Toggle tag
    const [isOnlineGroup, setIsOnlineGroup] = useState(false); //Toggle tag
    const [groupColor, setGroupColor] = useState("#000000"); //TextInput tag for now
    const [groupPhoto, setGroupPhoto] = useState(BLANK); //TextInput tag for now

    const [studyGroupCreationErrorMsg, setStudyGroupCreationErrorMsg] = useState(BLANK); //Toggle tag

    /**
     * Makes an api call to the Create study group route, passing in the information entered in the form and rendering the client according to the response received
     * @author Stacey Popenfoose and Ethan Cannelongo
     * @date   12/08/21
     */
    const submitCreateStudyGroup = async (event) => {
        //Prevent default form behavior

        event.preventDefault();
        event.stopPropagation();

        //Use axios to assign a variable called "response" to the response received when awaiting an API call to "Routes.Study.CreateStudyGroup," passing in an object with all of the values entered into the form.
        let response;
        try {
            axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

            response = await axios.post(Routes.StudyGroup.CreateStudyGroup, {
                name,
                groupColor,
                description,
                subject,
                privacySetting: privacy,
                course: courseCode,
                school: user.school || "Liberty University",
                isTutorGroup,
                isOnlineGroup
            });
            //Wrap the axios call in a try-catch block, using the catch block to call "setErrorMessage();" passing in "e.message"
        } catch (e) {
            console.log(e);
            setStudyGroupCreationErrorMsg(e.message);
            //In the finally block, use if statements to validate the following:
        } finally {
            //check if the response is valid, using Validator.isDefined(response),
            const responseIsDefined = Validator.isDefined(response);

            //if so, check if the response is successful
            if (responseIsDefined) {
                const studyGroupCreationWasValid =
                    ResponseMessages.StudyGroup.SuccessStudyGroupCreated === response.data.message;

                if (studyGroupCreationWasValid) {
                    //If all the conditions are satisfied, then use the dispatch function, passing in the "response.data" object.  This will dispatch an action to redux, which saves the study group to the global state of the app.
                    dispatch(addStudyGroup(response.data.newStudyGroup));
                    dispatch(closePopup());
                } else {
                    setStudyGroupCreationErrorMsg(response.data.message);
                }
            } else {
                setStudyGroupCreationErrorMsg("There's been a problem with the server");
            }
        }
    };

    /**
     * Used to update the name field in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   12/08/2021
     */
    const updateNameField = (event) => {
        setName(event.target.value);
        setStudyGroupCreationErrorMsg(BLANK);
    };

    /**
     * Used to update the group color field in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   12/08/2021
     */
    const updateGroupColor = (event) => {
        setGroupColor(event.target.value);
        setStudyGroupCreationErrorMsg(BLANK);
    };

    /**
     * Used to update the description field in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   12/08/2021
     */
    const updateDescriptionField = (event) => {
        setDescription(event.target.value);
        setStudyGroupCreationErrorMsg(BLANK);
    };

    /**
     * Used to update the subject field in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   12/08/2021
     */
    const updateSubjectField = (event) => {
        setSubject(event.target.options[event.target.selectedIndex].value);
        setStudyGroupCreationErrorMsg(BLANK);
    };

    /**
     * Used to update the privacy field in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   12/08/2021
     */
    const updatePrivacy = (event) => {
        setPrivacy(event.target.options[event.target.selectedIndex].value);
        setStudyGroupCreationErrorMsg(BLANK);
    };

    /**
     * Used to update the course code field in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   12/08/2021
     */
    const updateCourseCodeField = (event) => {
        setCourseCode(event.target.value);
        setStudyGroupCreationErrorMsg(BLANK);
    };

    /**
     * Used to update the is online group switch value in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   12/08/2021
     */
    const updateIsOnlineGroup = (event) => {
        setIsOnlineGroup(event.target.checked);
        setStudyGroupCreationErrorMsg(BLANK);
    };

    /**
     * Used to update the is associated with school switch value in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   12/08/2021
     */
    const updateIsAssociatedWithSchool = (event) => {
        setIsAssociatedWithSchool(event.target.checked);
        setStudyGroupCreationErrorMsg(BLANK);
    };

    /**
     * Used to update the is tutor group switch value in the create study group form.
     * @param {Event} event The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   12/08/2021
     */
    const updateIsTutorGroup = (event) => {
        setIsTutorGroup(event.target.checked);
        setStudyGroupCreationErrorMsg(BLANK);
    };

    return (
        <div className="create-studygroup-view">
            <CreateStudyGroupForm
                submitCreateStudyGroup={submitCreateStudyGroup}
                name={name}
                description={description}
                subject={subject}
                privacy={privacy}
                courseCode={courseCode}
                isAssociatedWithSchool={isAssociatedWithSchool}
                isTutorGroup={isTutorGroup}
                isOnlineGroup={isOnlineGroup}
                groupColor={groupColor}
                updateNameField={updateNameField}
                updateDescriptionField={updateDescriptionField}
                updateSubjectField={updateSubjectField}
                updatePrivacy={updatePrivacy}
                updateCourseCodeField={updateCourseCodeField}
                updateIsAssociatedWithSchool={updateIsAssociatedWithSchool}
                updateIsTutorGroup={updateIsTutorGroup}
                updateIsOnlineGroup={updateIsOnlineGroup}
                updateGroupColor={updateGroupColor}
                submitCreateStudyGroup={submitCreateStudyGroup}
                studyGroupCreationErrorMsg={studyGroupCreationErrorMsg}
            />
            <p className="error-message">{studyGroupCreationErrorMsg}</p>
        </div>
    );
};

export default CreateStudyGroupView;
