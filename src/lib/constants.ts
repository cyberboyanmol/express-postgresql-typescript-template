import { GlobalConstants } from '../interfaces/globalConstants.interface';

export const globalConstants: GlobalConstants = {
  status: {
    success: 'SUCCESS',
    failed: 'FAILED',
  },
  statusCode: {
    HttpsStatusCodeOk: {
      statusCodeName: 'HttpsStatusCodeOk',
      code: 200,
    },
    HttpsStatusCodeCreated: {
      statusCodeName: 'HttpsStatusCodeCreated',
      code: 201,
    },
    HttpsStatusCodeNoContent: {
      statusCodeName: 'HttpsStatusCodeNoContent',
      code: 204,
    },
    TemporaryRedirect: {
      statusCodeName: 'TemporaryRedirect',
      code: 307,
    },
    BadRequestException: {
      statusCodeName: 'BadRequestException',
      code: 400,
    },
    UnauthorizedException: {
      statusCodeName: 'UnauthorizedException',
      code: 401,
    },
    NotFoundException: {
      statusCodeName: 'NotFoundException',
      code: 404,
    },
    ForbiddenException: {
      statusCodeName: 'ForbiddenException',
      code: 403,
    },
    NotAcceptableException: {
      statusCodeName: 'NotAcceptableException',
      code: 406,
    },
    RequestTimeoutException: {
      statusCodeName: 'RequestTimeoutException',
      code: 408,
    },
    ConflictException: {
      statusCodeName: 'ConflictException',
      code: 409,
    },
    GoneException: {
      statusCodeName: 'GoneException',
      code: 410,
    },
    HttpVersionNotSupportedException: {
      statusCodeName: 'HttpVersionNotSupportedException',
      code: 505,
    },
    PayloadTooLargeException: {
      statusCodeName: 'PayloadTooLargeException',
      code: 413,
    },
    UnsupportedMediaTypeException: {
      statusCodeName: 'UnsupportedMediaTypeException',
      code: 415,
    },
    UnprocessableEntityException: {
      statusCodeName: 'UnprocessableEntityException',
      code: 422,
    },
    InternalServerErrorException: {
      statusCodeName: 'InternalServerErrorException',
      code: 500,
    },
    NotImplementedException: {
      statusCodeName: 'NotImplementedException',
      code: 501,
    },
    ImATeapotException: {
      statusCodeName: 'ImATeapotException',
      code: 418,
    },
    MethodNotAllowedException: {
      statusCodeName: 'MethodNotAllowedException',
      code: 405,
    },
    BadGatewayException: {
      statusCodeName: 'BadGatewayException',
      code: 502,
    },
    ServiceUnavailableException: {
      statusCodeName: 'ServiceUnavailableException',
      code: 503,
    },
    GatewayTimeoutException: {
      statusCodeName: 'GatewayTimeoutException',
      code: 504,
    },
    PreconditionFailedException: {
      statusCodeName: 'PreconditionFailedException',
      code: 412,
    },
  },
};
