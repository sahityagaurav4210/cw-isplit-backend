class RequestDTOValidationMessagesHelper {
  public static getValidationMessageForUserRegistrationDTO(): Record<string, any> {
    return {
      name: {
        'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'string.pattern.base': 'Name must contain only alphabets and spaces',
        'any.required': 'Name is required',
      },
      email: {
        'string.base': 'Email must be a string',
        'string.empty': 'Email is required',
        'string.pattern.base': 'Email must be a valid email address',
        'any.required': 'Email is required',
      },
      password: {
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        'any.required': 'Password is required',
      },
      phone: {
        'string.base': 'Phone number must be a string',
        'string.empty': 'Phone number is required',
        'string.pattern.base': 'Phone number must be a valid phone number',
      },
      photoUri: {
        'string.base': 'Photo URI must be a string',
        'string.empty': 'Photo URI is required',
        'string.pattern.base': 'Photo URI must be a valid url',
      },
    };
  }
}

export default RequestDTOValidationMessagesHelper;
