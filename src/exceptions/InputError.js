const ClientError = require("./ClientError");

class InputError extends ClientError {
    constructor(message, statusCode = 400) {
        super(message, statusCode);
        this.name = 'InputError';
    }
}

module.exports = InputError;
