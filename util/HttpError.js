class HttpError extends Error {
    constructor(message, errorCode) {
        super(message || 'Something went wrong, please try again later.');
        this.code = errorCode || 500;
    }
}

module.exports = HttpError;