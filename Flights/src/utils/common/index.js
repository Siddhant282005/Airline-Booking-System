const enums = require('./enums');

module.exports = {
    ErrorResponse: require('./error-response'),
    SuccessResponse: require('./success-response'),
    // provide both UPPERCASE and camelCase exports for compatibility
    ENUMS: enums,
    Enums: enums
}