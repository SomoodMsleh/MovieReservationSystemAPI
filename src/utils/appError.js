export class AppError extends Error {
    constructor(message,statusCode = 500){
        super(message||'Server error');
        this.statusCode = statusCode;
    }
}