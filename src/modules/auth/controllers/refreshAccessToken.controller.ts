import { HttpExceptionError } from '@/exceptions/http.exception';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import Api from '@/lib/api';
import { globalConstants } from '@/lib/constants';
import { RefreshAccessTokenService } from '../services/refreshAccessToken.service';
import { Payload, setAccessToken, setRefreshToken, verifyRefreshToken } from '@/utils';
import { AuthService } from '../services/auth.service';
import { getConfig } from '@/config';
import { logger } from '@/lib/logger';

export class RefreshAccessToken extends Api {
  private readonly RefreshAccessTokenService: RefreshAccessTokenService;
  private readonly AuthService: AuthService;
  private readonly verifyRefreshToken = verifyRefreshToken;
  constructor() {
    super();
    this.RefreshAccessTokenService = new RefreshAccessTokenService();
    this.AuthService = new AuthService();
  }
  public refreshAccessTokenHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookie = req.cookies;
      if (!cookie.jwt) {
        throw new HttpExceptionError(
          globalConstants.statusCode.UnauthorizedException.code,
          'JWT cookie is missing or Invalid !',
        );
      }
      // remove cookies from res if it is.
      const refreshToken = cookie.jwt;
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });

      // fetch user  based on refresh token
      const user = await this.RefreshAccessTokenService.findUserBasedOnRefreshToken(refreshToken);

      // if user not found
      if (!user) {
        // means refresh token resuse

        const decoded = (await this.verifyRefreshToken(refreshToken)) as Payload;

        //    remove all the refresh token from refresh model belong to hackedUser
        await this.RefreshAccessTokenService.deleteAllRefreshTokenForUser(decoded.userId);

        throw new HttpExceptionError(
          globalConstants.statusCode.ForbiddenException.code,
          'Invalid refresh token: Token reuse detected',
        );
      }

      const decoded = (await this.verifyRefreshToken(refreshToken)) as Payload;

      if (decoded.email !== user.email) {
        throw new HttpExceptionError(globalConstants.statusCode.UnauthorizedException.code, ' Invalid  user   !');
      }

      logger.info(`${user.userId} ${refreshToken} ${(decoded.userId, decoded.userId)}`);

      //   delete the refresh token from  refresh token array
      if (user.userId) {
        await this.RefreshAccessTokenService.removeRefreshToken(user.userId, refreshToken);
      }

      const newRefreshToken = await setRefreshToken({
        email: user.email,
        userId: user.userId,
      });

      await this.RefreshAccessTokenService.addRefreshToken(user.userId, newRefreshToken);

      const newAccessToken = await setAccessToken({
        email: user.email,
        userId: user.userId,
      });

      res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: getConfig().JWT_REFRESH_TOKEN_COOKIE_EXPIRATION,
      });
      this.send(res, { accessToken: newAccessToken }, 'New Access Token');
    } catch (err) {
      next(err);
    }
  };
}
