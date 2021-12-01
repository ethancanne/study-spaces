import React, { useState } from "react";
import CreateStudyGroupForm from "../../components/CreateStudyGroupForm/CreateStudyGroupForm";
import { useDispatch } from "react-redux";

/**
 * This is a specific view that is used in a popup to allow a user to create a study group
 * @author Ethan Cannelongo
 * @date   11/20/2021
 */
const CreateStudyGroupView = () => {
  const dispatch = useDispatch();

  const BLANK = "";
  const [title, setTitle] = useState(BLANK); //TextInput tag
  const [description, setDescription] = useState(BLANK); //TextInput tag
  const [category, setCategory] = useState(BLANK); //select tag, filled with option tags
  const [classCode, setClassCode] = useState(BLANK); //TextInput tag
  const [isAssociatedWithSchool, setIsAssociatedWithSchool] = useState(false); //Input tag with type "checkbox"
  const [isTutorGroup, setIsTutorGroup] = useState(false); //Toggle tag
  const [isOnlineGroup, setIsOnlineGroup] = useState(false); //Toggle tag

  const [groupColor, setGroupColor] = useState(BLANK); //TextInput tag for now
  const [groupPhoto, setGroupPhoto] = useState(BLANK); //TextInput tag for now

  /**
   * Makes an api call to the Create study group route, passing in the information entered in the form and
   * rendering the client according to the response received
   * @author Stacy Popenfoose
   * @date   12/08/21
   */
  const submitCreateStudyGroup = async (event) => {
    //Prevent default form behavior

    event.preventDefault();
    event.stopPropagation();

    //Use axios to assign a variable called "response" to the response received when awaiting an API call to "Routes.Study.CreateStudyGroup," passing in an object with all of the values entered into the form.

    //Wrap the axios call in a try-catch block, using the catch block to call "setErrorMessage();" passing in "e.message"

    //In the finally block, use if statements to validate the following:
    //check if the response is valid, using Validator.isDefined(response),
    //if so, check if the response is successful, using response.data.message === ResponseMessages.SuccessCreateStudyGroup.

    //If all the conditions are satisfied, then use the dispatch function, passing in the "response.data" object.  This will dispatch an action to redux, which saves the study group to the global state of the app.
  };

  const updateTitleField = (event) => {
    setTitle(event.target.value);
  };

  return (
    <div>
      <div>
        <CreateStudyGroupForm
          submitCreateStudyGroup={submitCreateStudyGroup}
          title={title}
          description={description}
          updateDescriptionField={setDescription}
          updateTitleField={updateTitleField}
        />
      </div>
    </div>
  );
};

export default CreateStudyGroupView;
