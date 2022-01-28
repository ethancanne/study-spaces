import React from "react";
import "./SearchForm.scss";
import Button from "../../core/Button/Button.js";
import ButtonTypes from "../../core/Button/ButtonTypes";
import Form from "../../core/Form/Form.js";
import InputField from "../../core/InputField/InputField.js";
import TextInput from "../../core/Inputs/TextInput/TextInput";
import Label from "../../core/Label/Label.js";
import ToggleField from "../../core/ToggleField/ToggleField.js";
import Toggle from "../../core/Toggle/Toggle.js";
import Dropdown from "../../core/Dropdown/Dropdown.js";

/**
 * Renders a search form for searching study groups
 * @author Stacey Popenfoose
 * @date 1/27/2022
 */
const SearchForm = ({
    searchTerm,
    isAssociatedWithSchool,
    isGroup,
    updateSearchTerm,
    updateCategory,
    updateIsAssociatedWithSchool,
    updateFormat,
    updateType,
    updateIsGroup,
    submitSearch
}) => {
    return (
        <div className="search-form">
            <Form onSubmit={submitSearch}>
                <InputField>
                    <Label>Search Term</Label>
                    <TextInput value={searchTerm} onChange={updateSearchTerm} />
                </InputField>
                <InputField>
                    <Label>Category</Label>
                    <Dropdown options={["Option 1", "Option 2", "Option 3"]} onChange={updateCategory} />
                </InputField>
                <InputField>
                    <Label>Meeting Format</Label>
                    <Dropdown options={["In Person", "Online", "Hybrid"]} onChange={updateFormat} />
                </InputField>
                <InputField>
                    <Label>Type</Label>
                    <Dropdown options={["Tutor", "Group", "Both"]} onChange={updateType} />
                </InputField>
                <ToggleField>
                    <Label>Show Only Liberty University Groups</Label>
                    <Toggle value={isAssociatedWithSchool} onChange={updateIsAssociatedWithSchool} type="checkbox" />
                </ToggleField>
                <Button type={ButtonTypes.Primary}>Search</Button>
            </Form>
        </div>
    );
};

export default SearchForm;
