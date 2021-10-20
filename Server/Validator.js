/**
* Used to validate and verify data throughout the application.
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
  */
  static isDefined(variable) {
    const undefinedType = "undefined";
    const isNotUndefined = (undefinedType !== typeof variable);
    const isNotNull = (null != variable);
    return (isNotUndefined && isNotNull);
  }

  /**
  * Checks if a variable is an error.
  * @param variable The variable to check for being an error.
  * @return {bool} True if the variable is an error, false otherwise.
  * @author Cameron Burkholder
  * @date   08/02/2021
  */
  static isError(variable) {
    const variableIsError = (variable instanceof Error);
    return variableIsError;
  }

  /**
  * Checks if a variable is undefined.
  * @param variable The variable to check for being undefined.
  * @return {bool} True if the variable is undefined, false otherwise.
  * @author Cameron Burkholder
  * @date   07/29/2021
  */
  static isUndefined(variable) {
    const undefinedType = "undefined";
    return (undefinedType === typeof variable);
  }
}

module.exports = Validator;
