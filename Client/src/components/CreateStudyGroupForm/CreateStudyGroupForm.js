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

const CreateStudyGroupForm = (props) => {
  return (
    <div>
      <Form onSubmit={props.submitCreateStudyGroup}>
        {/* Add the appropriate inputs, toggles and dropdown fields, each accompanied by a Label, for each of the fields (declared in CreateStudyGroupView File) that are required to create a study group */}

        {/* Don't forget a final submit button at the end of the form */}

        {/* Examples */}
        <InputField>
          <Label>Study Group Title</Label>
          <TextInput value={props.title} onChange={props.updateTitleField} type="text" />
        </InputField>

        <InputField>
          <Label>Study Group Description</Label>
          <TextInput value={props.descritption} onChange={props.updateDescriptionField} type="text" />
        </InputField>

        <InputField>
          <Label>Online Group?</Label>
          <Toggle />
        </InputField>
      </Form>
    </div>
  );
};

export default CreateStudyGroupForm;
