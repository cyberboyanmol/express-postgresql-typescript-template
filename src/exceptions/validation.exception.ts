import { HttpExceptionError } from './http.exception';
import { ValidationError } from 'class-validator';
export class ValidationException extends HttpExceptionError {
  public errors: ValidationError[];
  constructor(errors: ValidationError[], message: string) {
    super(400, message);
    this.errors = errors;
  }
}
