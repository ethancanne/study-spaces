import React from "react";
import "./SearchForm.scss";
import Button from "../../core/Button/Button.js";
import ButtonTypes from "../../core/Button/ButtonTypes";
import Form from "../../core/Form/Form.js";
import InputField from "../../core/InputField/InputField.js";
import TextInput from "../../core/Inputs/TextInput/TextInput";
import Label from "../../core/Label/Label.js";
import ToggleField from '../../core/ToggleField/ToggleField.js';
import Toggle from '../../core/Toggle/Toggle.js'
import Dropdown from "../../core/Dropdown/Dropdown";

/**
 * Renders a search form for searching study groups
 * @author Stacey Popenfoose
 * @date 1/27/2022
 */
const SearchForm = ({
    searchTerm,
    category,
    owner,
    classCode,
    proximity,
    isAssociatedWithSchool,
    isOnline,
    isTutor,
    isGroup,
    updateSearchTerm,
    updateCategory,
    updateOwner,
    updateClassCode,
    updateProximity,
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
                    <TextInput value={searchTerm} onChange={updateSearchTerm} />
                </InputField>
                <InputField>
                    <Label>Category</Label>
                    <TextInput value={category} onChange={updateCategory} />
                </InputField>
                <InputField>
                    <Label>Owner</Label>
                    <TextInput value={owner} onChange={updateOwner} />
                </InputField>
                <InputField>
                    <Label>Class Code</Label>
                    <TextInput value={classCode} onChange={updateClassCode} />
                </InputField>
                <InputField>
                    <Label>Proximity</Label>
                    <TextInput value={proximity} onChange={updateProximity} />
                </InputField>
                <ToggleField>
                    <Label>Show Only Liberty University Groups</Label>
                    <Toggle value={isAssociatedWithSchool} onChange={updateIsAssociatedWithSchool} type="checkbox" />
                </ToggleField>
                <ToggleField>
                    <Label>Show Only Online Groups</Label>
                    <Toggle value={isOnline} onChange={updateIsOnline} type="checkbox" />
                </ToggleField>
                <ToggleField>
                    <Label>Show Only Tutor Groups</Label>
                    <Toggle value={isTutor} onChange={updateIsTutor}/>
                </ToggleField>
                <Button type={ButtonTypes.Primary}>Search</Button>
            </Form>
        </div>
    );
};

export default SearchForm;
