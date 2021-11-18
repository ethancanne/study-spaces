import React from "react";
import "./CreateStudyGroupForm.scss";
import Button from "../../core/Button/Button.js";
import ButtonTypes from "../../core/Button/ButtonTypes";
import FileBase64 from "react-file-base64";
import Form from "../../core/Form/Form.js";
import InputField from "../../core/InputField/InputField.js";
import Label from "../../core/Label/Label.js";
import Routes from "../../../../Server/Routes/Routes.js";
import TextInput from "../../core/Inputs/TextInput/TextInput.js";

const CreateStudyGroupForm = (props) => {
  return (
    <div>
      <Form onSubmit={props.submitCreateStudyGroup}>{/* COMMENTS GO HERE */}</Form>
    </div>
  );
};

export default CreateStudyGroupForm;
