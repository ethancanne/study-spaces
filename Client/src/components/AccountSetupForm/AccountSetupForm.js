import React from "react";
import "./AccountSetupForm.scss";
import Button from "../../core/Button/Button.js";
import ButtonTypes from "../../core/Button/ButtonTypes";

import Form from "../../core/Form/Form.js";
import InputField from "../../core/InputField/InputField.js";
import Label from "../../core/Label/Label.js";
import Routes from "../../../../Server/Routes/Routes.js";
import TextInput from "../../core/Inputs/TextInput/TextInput.js";

const AccountSetupForm = (props) => {
  return (
    <div>
      <h3>Setup Your Account</h3>
      <p>{props.user.email}</p>
      <Form onSubmit={props.submitAccountSetup}>
        <InputField>
          <Label>Full Name</Label>
          <TextInput value={props.fullName} onChange={props.updateFullNameField} type="email" />
        </InputField>

        <div className="inline">
          <InputField id="left">
            <Label>Area Code</Label>
            <TextInput value={props.areaCode} onChange={props.updateAreaCodeField} />
          </InputField>
          <InputField id="right">
            <Label>Date of Birth</Label>
            <TextInput value={props.dateOfBirth} onChange={props.updateDateOfBirthField} />
          </InputField>
        </div>
        <InputField>
          <Label>Profile Picture</Label>
          <TextInput value={props.profilePicture} onChange={props.updateProfilePictureField} />
        </InputField>

        <Button type={ButtonTypes.Creation}>Create Account</Button>
      </Form>
    </div>
  );
};

export default AccountSetupForm;
