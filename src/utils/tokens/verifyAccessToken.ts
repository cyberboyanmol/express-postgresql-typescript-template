import { Response, NextFunction, Request } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { DecodedToken } from '@/utils';
import { CustomResponse } from '@/interfaces';
import { globalConstants } from '@/lib/constants';
import { HttpExceptionError } from '@/exceptions/http.exception';

const publicAccessTokenKeyPath = path.resolve(__dirname, '..', '..', 'keys', 'accessToken', 'public.key');

export async function verifyAccessToken(req: Request, res: Response<CustomResponse<null>>, next: NextFunction) {
  try {
    const authorization = req.headers.authorization as string;

    if (!authorization) {
      return res.status(globalConstants.statusCode.UnauthorizedException.code).json({
        status: globalConstants.status.failed,
        message: 'No authorization header | not authorized',
        data: null,
      });
    }

    //  if authorization header present but not in proper format

    const [bearer, token] = authorization.split(' ');

    if (bearer != 'Bearer' || !token) {
      throw new HttpExceptionError(
        globalConstants.statusCode.UnauthorizedException.code,
        'Invalid authorization header format. Format is "Bearer <token>".',
      );
    }

    try {
      const publickey = await fs.promises.readFile(publicAccessTokenKeyPath, 'utf8');

      const options: SignOptions = {
        algorithm: 'RS256',
        issuer: 'AudioLounge',
      };

      const decoded = jwt.verify(token, publickey, options) as DecodedToken;

      req.user = { userId: decoded.userId };

      next();
    } catch (err) {
      if ((err as Error).name !== 'TokenExpiredError') {
        throw new HttpExceptionError(globalConstants.statusCode.UnauthorizedException.code, 'Invalid  access token');
      }
      throw new HttpExceptionError(globalConstants.statusCode.UnauthorizedException.code, 'Token exipred');
    }
  } catch (err) {
    return res.status(globalConstants.statusCode.UnauthorizedException.code).json({
      status: globalConstants.status.failed,
      message: (err as Error).message,
      data: null,
    });
  }
}
