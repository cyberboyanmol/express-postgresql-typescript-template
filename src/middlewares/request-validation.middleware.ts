import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import type { Request, Response, NextFunction } from 'express';
import { logger } from '@/lib/logger';
import { ValidationException } from '@/exceptions/validation.exception';

async function validationPipe<T extends object>(
  req: Request,
  res: Response,
  next: NextFunction,
  dtoClass: new () => T,
) {
  const dto: InstanceType<typeof dtoClass> = plainToClass(dtoClass, req.body);
  const errors = await validate(dto);

  if (errors.length > 0) {
    const validationErrors = errors.map((error: ValidationError) => ({
      property: error.property,
      constraints: error.constraints,
    }));
    logger.error(validationErrors);
    const validationErrorText = 'Request validation failed!';
    next(new ValidationException(validationErrors, validationErrorText));
  } else {
    req.body = dto;
    next();
  }
}

export function ValidationPipe<T extends object>(dtoClass: new () => T) {
  return (req: Request, res: Response, next: NextFunction) => {
    validationPipe(req, res, next, dtoClass);
  };
}
