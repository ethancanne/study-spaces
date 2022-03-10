const ResponseMessages = require("./Responses/ResponseMessages");

/**
 * This is used to validate and verify data throughout the application.
 * @author Cameron Burkholder
 * @date   07/29/2021
 */
class Validator {
    /**
     * Checks if a variable is defined.
     * @param variable The variable to check for being defined.
     * @return {bool} True if the variable is defined, false otherwise.
     * @author Cameron Burkholder
     * @date   07/29/2021
     * @static
     */
    static isDefined(variable) {
        const undefinedType = "undefined";
        const isNotUndefined = undefinedType !== typeof variable;
        const isNotNull = null != variable;
        return isNotUndefined && isNotNull;
    }

    /**
     * Checks if a variable is an error.
     * @param variable The variable to check for being an error.
     * @return {bool} True if the variable is an error, false otherwise.
     * @author Cameron Burkholder
     * @date   08/02/2021
     * @static
     */
    static isError(variable) {
        const variableIsError = variable instanceof Error;
        return variableIsError;
    }

    /**
     * Checks if a variable is undefined.
     * @param variable The variable to check for being undefined.
     * @return {bool} True if the variable is undefined, false otherwise.
     * @author Cameron Burkholder
     * @date   07/29/2021
     * @static
     */
    static isUndefined(variable) {
        const undefinedType = "undefined";
        return undefinedType === typeof variable;
    }

    /**
     * Validates the form input for changing a user's email.
     * @author Cameron Burkholder
     * @date   03/08/2022
     * @static
     */
    static validateChangeEmail(request, response, nextMiddlewareFunction) {
        // CHECK THE INPUT FOR EMPTY VALUES.
        let inputIsValid = true;
        let error = ResponseMessages.Account.InvalidAccountInput;
        const { newEmail } = request.body;
        if (newEmail.length === 0) {
            inputIsValid = false;
        }

        // CHECK THAT THE EMAIL IS VALID.
        if (!Validator.validateEmail(newEmail)) {
            inputIsValid = false;
            error = ResponseMessages.Account.InvalidEmail;
        }

        // GENERATE THE RESPONSE.
        if (inputIsValid) {
            return nextMiddlewareFunction();
        } else {
            response.json({ message: error });
            return response.end();
        }
    }

    /**
     * Validates the form input for creating an account.
     * @author Cameron Burkholder
     * @date   03/08/2022
     * @static
     */
    static validateCreateAccountInput(request, response, nextMiddlewareFunction) {
        // CHECK THE INPUT FOR EMPTY VALUES.
        let inputIsValid = true;
        let error = ResponseMessages.Account.InvalidAccountInput;
        const { email, password, confirmPassword } = request.body;
        if (email.length === 0 || password.length === 0 || confirmPassword.length === 0) {
            inputIsValid = false;
        }

        // CHECK THAT THE EMAIL IS VALID.
        if (!Validator.validateEmail(email)) {
            inputIsValid = false;
            error = ResponseMessages.Account.InvalidEmail;
        }

        // CHECK THE INPUT FOR MINIMUM LENGTHS.
        const MINIMUM_PASSWORD_LENGTH = 6;
        if (password.length < MINIMUM_PASSWORD_LENGTH) {
            inputIsValid = false;
            error = ResponseMessages.Account.PasswordTooShort;
        }

        // CHECK THAT THE PASSWORDS MATCH.
        if (password !== confirmPassword) {
            inputIsValid = false;
            error = ResponseMessages.Account.PasswordsMustMatch;
        }

        // GENERATE THE RESPONSE.
        if (inputIsValid) {
            return nextMiddlewareFunction();
        } else {
            response.json({ message: error });
            return response.end();
        }
    }

    /**
     * Validates the input for creating a post.
     * @author Cameron Burkholder
     * @date   03/08/2022
     * @static
     */
    static validateCreatePost(request, response, nextMiddlewareFunction) {
        // CHECK THE INPUT FOR EMPTY VALUES.
        let inputIsValid = true;
        let error = ResponseMessages.StudyGroup.CreatePost.InvalidInput;
        const { title, message, category } = request.body;
        if (
            title == null ||
            title.length === 0 ||
            message == null ||
            message.length === 0 ||
            category == null ||
            category.length === 0
        ) {
            inputIsValid = false;
        }

        // GENERATE THE RESPONSE.
        if (inputIsValid) {
            request.body.type = request.body.category;
            request.body.profilePicture = request.body.attachment;
            return nextMiddlewareFunction();
        } else {
            response.json({ message: error });
            return response.end();
        }
    }

    /**
     * Validates the form input for creating a study group before a study group gets created.
     * @author Cameron Burkholder
     * @date   02/04/2022
     * @static
     */
    static validateCreateStudyGroupInput(request, response, nextMiddlewareFunction) {
        // GET THE FORM INPUT DATA.
        // The data will all be in the request.body object as attributes according to each's name.
        let studyGroupIsValid = false;
        // VALIDATE THE INPUT.
        if (request.body.name && request.user) {
            studyGroupIsValid = true;
        }
        // GENERATE THE RESPONSE.
        // If the data is invalid, then a response should be returned with the appropriate message indicating such.
        if (!studyGroupIsValid) {
            response.json({ message: ResponseMessages.StudyGroup.ErrorNullStudyGroupInput });
            return response.end();
        }
        // If the data is valid, then the next function in the middleware chain can be called.
        else {
            return nextMiddlewareFunction();
        }
    }

    /**
     * Validates the input for editing a meeting.
     * @author Cameron Burkholder
     * @date   03/08/2022
     * @static
     */
    static validateEditMeeting(request, response, nextMiddlewareFunction) {
        // CHECK THE INPUT FOR EMPTY VALUES.
        let inputIsValid = true;
        let error = ResponseMessages.StudyGroup.InvalidAccountInput;
        const { date, time } = request.body;
        if (Validator.isUndefined(date) || Validator.isUndefined(time)) {
            inputIsValid = false;
        }

        // GENERATE THE RESPONSE.
        if (inputIsValid) {
            return nextMiddlewareFunction();
        } else {
            response.json({ message: error });
            return response.end();
        }
    }

    /**
     * Validates the input for editing a study group.
     * @author Cameron Burkholder
     * @date   03/08/2022
     * @static
     */
    static validateEditStudyGroup(request, response, nextMiddlewareFunction) {
        // CHECK THE INPUT FOR EMPTY VALUES.
        let inputIsValid = true;
        let error = ResponseMessages.StudyGroup.InvalidEditStudyGroup;
        const { course, description, groupColor, isOnlineGroup, isTutorGroup, name, subject } = request.body;
        if (name == null || name.length === 0 || name == "" || description == null || description.length === 0) {
            inputIsValid = false;
        }

        // GENERATE THE RESPONSE.
        if (inputIsValid) {
            return nextMiddlewareFunction();
        } else {
            response.json({ message: error });
            return response.end();
        }
    }

    /**
     * Checks if an email is valid.
     * @author W3Schools
     * @static
     */
    static validateEmail(email) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Validates the input for creating a one-time meeting.
     * @author Cameron Burkholder
     * @date   03/08/2022
     * @static
     */
    static validateOneTimeMeeting(request, response, nextMiddlewareFunction) {
        // CHECK THE INPUT FOR EMPTY VALUES.
        let inputIsValid = true;
        let error = ResponseMessages.StudyGroup.AddOneTimeMeeting.InvalidInput;
        const { date, time, day, details, location, roomNumber } = request.body;
        if (Validator.isUndefined(date) || Validator.isUndefined(time) || date.length === 0 || time.length === 0) {
            inputIsValid = false;
        }

        // GENERATE THE RESPONSE.
        if (inputIsValid) {
            return nextMiddlewareFunction();
        } else {
            response.json({ message: error });
            return response.end();
        }
    }

    /**
     * Validates the input for setting a recurring meeting.
     * @author Cameron Burkholder
     * @date   03/08/2022
     * @static
     */
    static validateSetRecurringMeeting(request, response, nextMiddlewareFunction) {
        // CHECK THE INPUT FOR EMPTY VALUES.
        let inputIsValid = true;
        let error = ResponseMessages.StudyGroup.SetRecurringMeeting.InvalidInput;
        const { day, frequency, time, date } = request.body;
        if (
            frequency == null ||
            time == null ||
            frequency.length === 0 ||
            time.length === 0 ||
            Validator.isUndefined(date)
        ) {
            inputIsValid = false;
        }

        // GENERATE THE RESPONSE.
        if (inputIsValid) {
            return nextMiddlewareFunction();
        } else {
            response.json({ message: error });
            return response.end();
        }
    }

    /**
     * Validates the input for setting up an account.
     * @author Cameron Burkholder
     * @date   03/08/2022
     * @static
     */
    static validateSetupAccount(request, response, nextMiddlewareFunction) {
        // CHECK THE INPUT FOR EMPTY VALUES.
        let inputIsValid = true;
        let error = ResponseMessages.Account.InvalidAccountInput;
        const { areaCode, name } = request.body;
        if (areaCode.length === 0 || name.length === 0) {
            inputIsValid = false;
        }

        // CHECK THAT THE EMAIL IS VALID.
        if (!Validator.validateEmail(email)) {
            inputIsValid = false;
            error = ResponseMessages.Account.InvalidEmail;
        }

        // CHECK THE INPUT FOR MINIMUM LENGTHS.
        const MINIMUM_PASSWORD_LENGTH = 6;
        if (password.length < MINIMUM_PASSWORD_LENGTH) {
            inputIsValid = false;
            error = ResponseMessages.Account.PasswordTooShort;
        }

        // CHECK THAT THE PASSWORDS MATCH.
        if (password !== confirmPassword) {
            inputIsValid = false;
            error = ResponseMessages.Account.PasswordsMustMatch;
        }

        // GENERATE THE RESPONSE.
        if (inputIsValid) {
            return nextMiddlewareFunction();
        } else {
            response.json({ message: error });
            return response.end();
        }
    }

    /**
     * Validates the input for changing a password.
     * @author Cameron Burkholder
     * @date   02/08/2022
     * @static
     */
    static validatePasswordInput(request, response, nextMiddlewareFunction) {
        // GET THE FORM INPUT DATA.
        const currentPassword = request.body.currentPassword;
        const newPassword = request.body.newPassword;

        // CHECK THAT NEITHER INPUT IS EMPTY.
        const EMPTY_STRING = "";
        const currentPasswordIsEmpty = EMPTY_STRING === currentPassword;
        const newPasswordIsEmpty = EMPTY_STRING === newPassword;
        const passwordsAreEmpty = currentPasswordIsEmpty && newPasswordIsEmpty;
        if (passwordsAreEmpty) {
            response.json({ message: ResponseMessages.Account.ErrorInvalidPasswordInput });
            return response.end();
        }

        // CONTINUE WITH THE PASSWORD CHANGING PROCESS.
        return nextMiddlewareFunction();
    }
}

module.exports = Validator;
