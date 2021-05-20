import validator from 'validator';

/*
 * This class contains methods for validating fields using 'validator.js' library methods
 * The methods return error message if validation failed and false otherwise
 * You can use all supported validators and sanitizers of 'validator.js' libaray
 * See their docs here https://github.com/validatorjs/validator.js
 */

class ValidateFields {
  /*
   * A method that takes in the email
   * Validates it
   * Returns the response either error or false if there is no error
   */
  validateTitle(title) {
    if (validator.isEmpty(title)) {
      return 'Title is required';
    } else if (!validator.isLength(title)) {
      return 'Invalid title';
    }
    return false;
  }

  validateLocation(location) {
    if (validator.isEmpty(location)) {
      return 'location is required';
    } else if (!validator.isLength(location, { min: 8 })) {
      return 'location sould be minimum 8 characters';
    }
    return false;
  }

  validatePartisipant(partisipant){
    if (validator.isEmpty(partisipant)) {
        return 'partisipant is required';
      } else if (!validator.isLength(partisipant, { min: 3 })) {
        return 'partisipant sould be minimum 8 characters';
      }
      return false;
  }

  validateDescription(description){
    if (validator.isEmpty(description)) {
        return 'description is required';
      } else if (!validator.isLength(description, { min: 50 })) {
        return 'description sould be minimum 50 characters';
      }
      return false;
  }
}

const validateFields = new ValidateFields();

// export the class instance, so we can import and use it anywhere
export { validateFields };