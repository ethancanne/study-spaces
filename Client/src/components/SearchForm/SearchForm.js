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
    proximity,
    schoolOnly,
    onlineOnly,
    tutorOnly,
    updateSearchTerm,
    updateCategory,
    updateProximity,
    updateSchoolOnly,
    updateOnlineOnly,
    updateTutorOnly,
    submitSearch
}) => {
    return (
        <div className="search-form">
            <Form onSubmit={submitSearch}>
                <InputField>
                    <Label></Label>
                    <TextInput value="" onChange="" />
                </InputField>
                <InputField>
                    <Label></Label>
                    <TextInput value="" onChange="" />
                </InputField>
                <Button type={ButtonTypes.Primary}>Search</Button>
            </Form>
        </div>
    );
};

export default SearchForm;
