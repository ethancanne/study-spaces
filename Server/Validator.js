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
        if(request.body.name && request.user) {
            studyGroupIsValid = true;
        }
        // GENERATE THE RESPONSE.
        // If the data is invalid, then a response should be returned with the appropriate message indicating such.
        if(!studyGroupIsValid) {
            return response.json({ message: ResponseMessages.StudyGroup.ErrorNullStudyGroupInput });
        }
        // If the data is valid, then the next function in the middleware chain can be called.
        else {
            return nextMiddlewareFunction();
        }
      
    }
}

module.exports = Validator;
