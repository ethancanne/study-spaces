import React, { useState } from "react";
import "./CreateStudyGroupForm.scss";
import Form from "../../core/Form/Form.js";

import Button from "../../core/Button/Button.js";
import ButtonTypes from "../../core/Button/ButtonTypes";
import InputField from "../../core/InputField/InputField.js";
import Label from "../../core/Label/Label.js";
import Routes from "../../../../Server/Routes/Routes.js";
import TextInput from "../../core/Inputs/TextInput/TextInput.js";

import ToggleField from "../../core/ToggleField/ToggleField.js";
import Toggle from "../../core/Toggle/Toggle.js";

import ResponseMessages from "../../../../Server/Responses/ResponseMessages";
import axios from "axios";
import Dropdown from "../../core/Dropdown/Dropdown";
import ColorPicker from "../../core/ColorPicker/ColorPicker";


{
    /* ? */
}
/**
 * @param {string} props.title
 * @param {string} props.description
 * @param {} props.privacy
 * @param {} props.subject
 * @param {} props.classCode
 * @param {} props.isAssociatedWithSchool
 * @param {} props.isTutorGroup
 * @param {} props.isOnlineGroup
 *
 */
const CreateStudyGroupForm = (props) => {
    return (
        <div>
            <Form onSubmit={props.submitCreateStudyGroup} className="create-study-group-form">
                {/* Add the appropriate inputs, toggles and dropdown fields, each accompanied by a Label, for each of the fields (declared in CreateStudyGroupView File) that are required to create a study group */}
                {/* Don't forget a final submit button at the end of the form */}

                {/* user text input */}
                <div className="side-by-side">
                  <InputField>
                      <Label>Study Group Name</Label>
                      <TextInput value={props.name} onChange={props.updateNameField} type="text" />
                  </InputField>
                  <InputField>
                      <Label>Color</Label>
                      <ColorPicker value={props.groupColor} onChange={props.updateGroupColor} type="color" />
                  </InputField>
                </div>

                <InputField>
                    <Label>Description</Label>
                    {/* not sure about what the props. thing should say */}
                    <TextInput value={props.description} onChange={props.updateDescriptionField} type="text" isTextArea={true}/>
                </InputField>

                {/* dropdowns */}
               
                <div className="side-by-side">
                  <InputField>
                    <Label>Subject</Label>
                    <Dropdown options={["This", "That"]} onChange={props.updateSubjectField}/>
                  </InputField>
                  
                  <InputField>
                    <Label>Privacy</Label>
                    <Dropdown options={["Public", "Public", "Public"]} onChange={props.updatePrivacy}/>
                  </InputField>

                  <InputField>
                    <Label>Course Code</Label>
                    <TextInput value={props.courseCode} onChange={props.updateCourseCodeField} type="text"/>
                  </InputField>
                </div>

                {/* class code */}

                {/* toggles */}
                <div className="side-by-side">
                  <ToggleField>
                      <Label>Is this group associated with your school?</Label>
                      <Toggle onChange={props.updateIsAssociatedWithSchool}/>
                  </ToggleField>
                  <ToggleField>
                      <Label>Is this an online group?</Label>
                      <Toggle onChange={props.updateIsOnlineGroup}/>
                  </ToggleField>
                  
                  <ToggleField>
                      <Label>Is this a tutor group?</Label>
                      <Toggle onChange={props.updateIsTutorGroup}/>
                  </ToggleField>
                </div>

                <Button type={ButtonTypes.Creation}>Submit</Button>
            </Form>
        </div>
    );
};

export default CreateStudyGroupForm;
