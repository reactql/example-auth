// Generic form error class.  Allows simple error detection with .is(), and
// an ErrorType-compatible object with .errors()
export default class FormError {
  // Errors are stored on a plain object, in the form { fieldName: message }
  constructor() {
    this.errors = {};
  }

  // Boolean to signal whether we have any errors
  is() {
    return !!Object.keys(this.errors).length;
  }

  // Set an error by field name and error message
  set(field, message) {
    this.errors[field] = message;
  }

  // Returns errors as an array of { field, message }
  getErrors() {
    return Object.keys(this.errors).map(field => ({
      field,
      message: this.errors[field],
    }));
  }

  // Throws if we have a current error.  This will throw a GraphQL `ErrorType`
  // compatible object that can be caught further up the callstack
  throwIf() {
    if (this.is()) {
      throw this.getErrors();
    }
  }
}
