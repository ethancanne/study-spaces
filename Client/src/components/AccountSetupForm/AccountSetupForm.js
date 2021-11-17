import React from "react";
import "./AccountSetupForm.scss";
import Button from "../../core/Button/Button.js";
import ButtonTypes from "../../core/Button/ButtonTypes";
import FileBase64 from "react-file-base64";
import Form from "../../core/Form/Form.js";
import InputField from "../../core/InputField/InputField.js";
import Label from "../../core/Label/Label.js";
import Routes from "../../../../Server/Routes/Routes.js";
import TextInput from "../../core/Inputs/TextInput/TextInput.js";

const AccountSetupForm = (props) => {
  return (
    <div>
      <Form onSubmit={props.submitAccountSetup}>
        <InputField>
          <Label>Full Name</Label>
          <TextInput value={props.fullName} onChange={props.updateFullName} />
        </InputField>

        {/* <div className="inline"> */}
        <InputField>
          <Label>Area Code</Label>
          <TextInput value={props.areaCode} onChange={props.updateAreaCode} />
        </InputField>
        <InputField>
          <Label>Date of Birth</Label>
          <TextInput value={props.dateOfBirth} onChange={props.updateDateOfBirth} />
        </InputField>
        {/* </div> */}
        <InputField>
          <Label>Profile Picture</Label>
          <div className="inline">
            <FileBase64
              id="fileInput right"
              multiple={false}
              onDone={({ base64 }) => props.updateProfilePicture(base64)}
            />
            <img className="imgPreview" id="left" src={props.profilePicture} alt="" />
          </div>
        </InputField>

        <Button type={ButtonTypes.Creation}>Create Account</Button>
      </Form>
    </div>
  );
};

export default AccountSetupForm;
