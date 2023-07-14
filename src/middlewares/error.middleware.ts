import { logger } from '@/lib/logger';
import type { NextFunction, Request, Response } from 'express';
import { HttpExceptionError } from '@/exceptions/http.exception';
import { ValidationException } from '@/exceptions/validation.exception';
import { globalConstants } from '@/lib/constants';

interface validationError {
  error: string;
  field: string | undefined;
}

export const errorMiddleware = async (error: HttpExceptionError, req: Request, res: Response, next: NextFunction) => {
  try {
    if (error instanceof ValidationException) {
      const message: validationError[] = [];
      const status = 400;
      for (const err of error.errors) {
        message.push({
          field: err.property,
          error: Object.values(err.constraints ?? {}).join('; '),
        });
      }
      logger.error(`[${req.method}] ${req.path} || StatusCode:: ${status}, Message:: ${message}`);

      res.status(status).json({
        status: globalConstants.status.failed,
        message,
        data: null,
      });
    } else {
      const status = error.status || 500;
      const message = error.message || 'Something went wrong';
      const ErrorStack = process.env.NODE_ENV !== 'production' ? error.stack : '';

      logger.error(`[${req.method}] ${req.path} || StatusCode:: ${status}, Message:: ${message}`);

      if (process.env.NODE_ENV !== 'production') {
        res.status(status).json({
          status: globalConstants.status.failed,
          message,
          data: null,
          ErrorStack,
        });
      } else {
        res.status(status).json({
          status: globalConstants.status.failed,
          message,
          data: null,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};
