import React from "react";
import "./SearchForm.scss";
import Button from "../../core/Button/Button.js";
import ButtonTypes from "../../core/Button/ButtonTypes";
import Form from "../../core/Form/Form.js";
import InputField from "../../core/InputField/InputField.js";
import TextInput from "../../core/Inputs/TextInput/TextInput";
import Label from "../../core/Label/Label.js";

/**
 * Renders a search form for searching study groups
 * @author ???
 */
const SearchForm = ({
    searchTerm,
    category,
    isAssociatedWithSchool,
    isOnline,
    isTutor,
    isGroup,
    updateSearchTerm,
    updateCategory,
    updateIsAssociatedWithSchool,
    updateIsOnline,
    updateIsTutor,
    updateIsGroup,
    submitSearch
}) => {
    return (
        <div className="search-form">
            <Form onSubmit={submitSearch}>
                <InputField>
                    <Label>Title</Label>
                    <TextInput value="" onChange="" />
                </InputField>
                <InputField>
                    <Label>Category</Label>
                    <TextInput value="" onChange="" />
                </InputField>
                <InputField>
                    <Label>Owner</Label>
                    <TextInput value="" onChange="" />
                </InputField>
                <InputField>
                    <Label>Class Code</Label>
                    <TextInput value="" onChange="" />
                </InputField>
                <InputField>
                    <Label>Proximity</Label>
                    <TextInput value="" onChange="" />
                </InputField>
                <InputField>
                    <Label></Label>
                    <TextInput value="" onChange="" type="checkbox" />
                </InputField>
                <InputField>
                    <Label>Show Only Liberty University Groups</Label>
                        <label class="switch">
                            <TextInput value="" onChange="" type="checkbox" />
                            <span class="slider round"></span>
                        </label>
                </InputField>
                <InputField>
                    <Label>Show Only Online Groups</Label>
                    <TextInput value="" onChange="" type="checkbox" />
                </InputField>
                <InputField>
                    <Label>Show Only Tutor Groups</Label>
                    <TextInput value="" onChange="" type="checkbox" />
                </InputField>
                <Button type={ButtonTypes.Primary}>Search</Button>
            </Form>
        </div>
    );
};

export default SearchForm;
