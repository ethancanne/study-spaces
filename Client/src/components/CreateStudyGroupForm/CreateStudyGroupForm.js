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
import Subjects from "../../../../Server/Models/Subjects.js";

/**
 * Renders a create study group form
 * @param {String} props.title
 * @param {String} props.description
 * @param {String} props.privacy
 * @param {String} props.subject
 * @param {String} props.classCode
 * @param {boolean} props.isAssociatedWithSchool
 * @param {boolean} props.isTutorGroup
 * @param {boolean} props.isOnlineGroup
 *
 */
const CreateStudyGroupForm = (props) => {
    return (
        <div>
            <Form onSubmit={props.submitCreateStudyGroup} className="create-study-group-form">
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
                    <TextInput
                        value={props.description}
                        onChange={props.updateDescriptionField}
                        type="text"
                        isTextArea={true}
                    />
                </InputField>

                {/* dropdowns */}

                <div className="side-by-side">
                    <InputField>
                        <Label>Subject</Label>
                        <Dropdown
                            value={props.subject}
                            options={Object.keys(Subjects)}
                            onChange={props.updateSubjectField}
                        />
                    </InputField>

                    <InputField>
                        <Label>Privacy</Label>
                        <Dropdown value={props.privacy} options={["Public"]} onChange={props.updatePrivacy} />
                    </InputField>

                    <InputField>
                        <Label>Course Code</Label>
                        <TextInput value={props.courseCode} onChange={props.updateCourseCodeField} type="text" />
                    </InputField>
                </div>

                {/* toggles */}
                <div className="side-by-side">
                    {props.userSchool !== "" && props.userSchool && (
                        <ToggleField>
                            <Label>Is this group associated with {props.userSchool}?</Label>
                            <Toggle
                                onChange={props.updateIsAssociatedWithSchool}
                                value={props.isAssociatedWithSchool}
                            />
                        </ToggleField>
                    )}

                    <ToggleField>
                        <Label>Is this an online group?</Label>
                        {console.log("Is Online?", props.isOnlineGroup)}
                        <Toggle onChange={props.updateIsOnlineGroup} value={props.isOnlineGroup} />
                    </ToggleField>

                    <ToggleField>
                        <Label>Is this a tutor group?</Label>
                        <Toggle onChange={props.updateIsTutorGroup} value={props.isTutorGroup} />
                    </ToggleField>
                </div>

                <Button type={ButtonTypes.Creation}>Submit</Button>
            </Form>
        </div>
    );
};

export default CreateStudyGroupForm;
