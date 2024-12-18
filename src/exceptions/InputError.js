const ClientError = require('./ClientError');

class InputError extends ClientError {
    constructor(message) {
        super(message, 400); // statusCode 400 untuk Bad Request
        this.name = 'InputError';
    }
}

module.exports = InputError;