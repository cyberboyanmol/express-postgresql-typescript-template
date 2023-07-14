enum Status {
  HttpsStatusCodeOk = 200,
  HttpsStatusCodeCreated = 201,
  BadRequestException = 400,
  UnauthorizedException = 401,
  NotFoundException = 404,
  ForbiddenException = 403,
  NotAcceptableException = 406,
  RequestTimeoutException = 408,
  ConflictException = 409,
  GoneException = 410,
  HttpVersionNotSupportedException = 505,
  PayloadTooLargeException = 413,
  UnsupportedMediaTypeException = 415,
  UnprocessableEntityException = 422,
  InternalServerErrorException = 500,
  NotImplementedException = 501,
  ImATeapotException = 418,
  MethodNotAllowedException = 405,
  BadGatewayException = 502,
  ServiceUnavailableException = 503,
  GatewayTimeoutException = 504,
  PreconditionFailedException = 412,
}

export class HttpExceptionError extends Error {
  public status: Status;

  constructor(status: Status, public readonly message: string) {
    super();
    this.status = status;
    this.message = message;
    this.name = 'HttpExceptionError';
  }
}
