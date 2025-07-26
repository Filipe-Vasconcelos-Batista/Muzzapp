export class ApiError extends Error {
    public errors?: string[]
    constructor(message:string, errors?: string[]){
        super(message);
        this.name='ApiError'
        this.errors = errors;
    }
}
