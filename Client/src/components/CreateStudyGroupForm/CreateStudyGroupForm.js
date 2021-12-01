import React, { useState } from "react";
import "./CreateStudyGroupForm.scss";
import Form from "../../core/Form/Form.js";

import Button from "../../core/Button/Button.js";
import ButtonTypes from "../../core/Button/ButtonTypes";
import InputField from "../../core/InputField/InputField.js";
import Label from "../../core/Label/Label.js";
import Routes from "../../../../Server/Routes/Routes.js";
import TextInput from "../../core/Inputs/TextInput/TextInput.js";
import Toggle from "../../core/Toggle/Toggle.js";

import ResponseMessages from "../../../../Server/Responses/ResponseMessages";
import axios from "axios";


{
  /* ? */
}
/**
 * @param {string} props.title
 * @param {string} props.description
 * @param {} props.privacy
 * @param {} props.category
 * @param {} props.classCode
 * @param {} props.isAssociatedWithSchool
 * @param {} props.isTutorGroup
 * @param {} props.isOnlineGroup
 *
 */

const CreateStudyGroupForm = (props) => {
  return (
    <div className="create-studygroup-form">
      <Form onSubmit={props.submitCreateStudyGroup}>
        {/* Add the appropriate inputs, toggles and dropdown fields, each accompanied by a Label, for each of the fields (declared in CreateStudyGroupView File) that are required to create a study group */}
        {/* Don't forget a final submit button at the end of the form */}

        {/* user text input */}
        <InputField>
          <Label>Study Group Title</Label>
          <TextInput value={props.title} onChange={props.updateTitleField} type="text" />
        </InputField>

        <InputField>
          <Label>Description</Label>
          {/* not sure about what the props. thing should say */}
          <TextInput value={props.description} onChange={props.updateDescriptionField} type="text" />
        </InputField>

        {/* dropdowns */}
        <InputField>
          <Label>Privacy</Label>
          <div class="privacy">
            <Button type={ButtonTypes.Primary}>Privacy</Button>
            <a href="#">Public</a>
            <a href="#">Private</a>
          </div>
        </InputField>

        <InputField>
          <Label>Category</Label>
          <div class="category">
            <Button type={ButtonTypes.Primary}>Category</Button>
            {/* what are the category options? */}
            <a href="#"></a>
            <a href="#"></a>
          </div>
        </InputField>

        {/* class code */}

        {/* toggles */}
        <InputField>
          <Label>Online Group</Label>
          <Toggle />
        </InputField>

        <InputField>
          <Label>Tutor Group</Label>
          <Toggle />
        </InputField>

        <Button type={ButtonTypes.Creation}>Submit</Button>
      </Form>
    </div>
  );
};

export default CreateStudyGroupForm;
