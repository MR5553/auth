class APIError extends Error {
    statusCode: number;
    data: unknown;
    success: boolean;
    Errors: Error[];
    constructor(
        statusCode: number,
        message = "something went wrong",
        Errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message;
        this.success = false
        this.Errors = Errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { APIError };