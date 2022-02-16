import "./InputView.scss";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { closePopup } from "../../state/actions";
import Form from "../../core/Form/Form";
import Button from "../../core/Button/Button";
import ButtonTypes from "../../core/Button/ButtonTypes";
import InputField from "../../core/InputField/InputField";
import TextInput from "../../core/Inputs/TextInput/TextInput";
import Label from "../../core/Label/Label";

const InputView = ({ label, defaultInput = "", callback, label2 = "" }) => {
    const dispatch = useDispatch();
    const [input, setInput] = useState(defaultInput);
    const [input2, setInput2] = useState(defaultInput);

    /**
     * Used to update the input field in the input popup
     * @param {Event} e The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/07/2022
     */
    const updateInput = (e) => {
        setInput(e.target.value);
    };

    /**
     * Used to update the second input field in the input popup
     * @param {Event} e The change event to update the field with.
     * @author Ethan Cannelongo
     * @date   02/07/2022
     */
    const updateInput2 = (e) => {
        setInput2(e.target.value);
    };

    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch(closePopup());
                callback(input, input2);
                setInput("");
            }}
        >
            <InputField>
                <Label>{label}</Label>
                <TextInput onChange={updateInput} value={input} />
            </InputField>

            {label2 !== "" && (
                <InputField>
                    <Label>{label2}</Label>
                    <TextInput onChange={updateInput2} value={input2} />
                </InputField>
            )}
            <Button type={ButtonTypes.Creation}>Done</Button>
        </Form>
    );
};

export default InputView;
