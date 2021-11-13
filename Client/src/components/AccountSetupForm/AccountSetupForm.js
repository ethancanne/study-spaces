import React from "react";
import "./AccountSetupForm.scss";

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
          <InputField className="left">
            <Label>Area Code</Label>
            <TextInput value={props.areaCode} onChange={props.updateAreaCodeField} />
          </InputField>
          <InputField className="right">
            <Label>Date of Birth</Label>
            <TextInput value={props.dateOfBirth} onChange={props.updateDateOfBirthField} />
          </InputField>
        </div>
        <InputField className="right">
          <Label>Profile Picture</Label>
          <TextInput value={props.profilePicture} onChange={props.updateProfilePictureField} />
        </InputField>

        <Button type={ButtonTypes.Creation}>Create Account</Button>
      </Form>
    </div>
  );
};

export default AccountSetupForm;
