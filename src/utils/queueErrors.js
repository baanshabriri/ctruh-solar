export class TransientError extends Error {
    constructor(message) {
        super(message);
        this.name = "TransientError";
    }
}

export class PermanentError extends Error {
    constructor(message) {
        super(message);
        this.name = "PermanentError";
    }
}