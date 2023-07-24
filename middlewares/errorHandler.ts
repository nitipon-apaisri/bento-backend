class ErrorHandler extends Error {}

export class NotFoundError extends ErrorHandler {
    constructor() {
        super();
        this.name = "404";
    }
}
