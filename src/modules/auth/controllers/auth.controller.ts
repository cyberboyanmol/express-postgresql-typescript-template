import { NextFunction, Request, RequestHandler, Response } from 'express';
import Api from '@/lib/api';
import { AuthService } from '../services/auth.service';
import { HttpExceptionError } from '@/exceptions/http.exception';
import { globalConstants } from '@/lib/constants';
import { OtpService, setAccessToken, setRefreshToken } from '@/utils';
import { User } from '@prisma/client';
import { getConfig } from '@/config';
import { RefreshAccessTokenService } from '../services/refreshAccessToken.service';
import { logger } from '@/lib/logger';

export class AuthController extends Api {
  private readonly AuthService: AuthService;
  private readonly OtpService: OtpService;
  private readonly RefreshAccessTokenService: RefreshAccessTokenService;

  constructor() {
    super();
    this.AuthService = new AuthService();
    this.OtpService = new OtpService();
    this.RefreshAccessTokenService = new RefreshAccessTokenService();
  }

  public EmailSignUpHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.AuthService.signUpWithEmail(req.body);

      this.send(res, response, `Otp sent successfully to your ${req.body.email} `);
    } catch (err) {
      next(err);
    }
  };

  public VerifyOtpHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hash, email, otp } = req.body;
      const [otphashed, expireTime] = hash.split('.');

      // check is otp expired
      if (Date.now() > +expireTime) {
        throw new HttpExceptionError(
          globalConstants.statusCode.BadRequestException.code,
          'Expired OTP (One time password) !',
        );
      }

      //check is otp is valid
      const data = `${email}${otp}${expireTime}`;
      const isValid = await this.OtpService.verifyHash(otphashed, data);

      if (!isValid) {
        throw new HttpExceptionError(
          globalConstants.statusCode.BadRequestException.code,
          'Invalid OTP (One time password)',
        );
      }
      //  is user exist
      const user = await this.AuthService.findUser(email);

      if (!user) {
        // create the user
        // and generate the access token and refresh token
        this.createNewAccountHandler(req, res, next);
      } else {
        if (user?.provider === 'LOCAL') {
          // generate the access token and refresh token and send back to user

          const cookies = req.cookies;

          if (cookies.jwt) {
            const refreshToken = cookies.jwt;

            const foundUser = await this.RefreshAccessTokenService.findUserBasedOnRefreshToken(refreshToken);

            if (foundUser) {
              await this.RefreshAccessTokenService.removeRefreshToken(user.userId, refreshToken);
            } else {
              await this.RefreshAccessTokenService.deleteAllRefreshTokenForUser(user.userId);
            }
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
          }

          const newRefreshToken = await setRefreshToken({
            email: user.email,
            userId: user.userId,
          });
          const newAccessToken = await setAccessToken({
            email: user.email,
            userId: user.userId,
          });

          await this.RefreshAccessTokenService.addRefreshToken(user.userId, newRefreshToken);

          res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: getConfig().JWT_REFRESH_TOKEN_COOKIE_EXPIRATION,
          });

          this.send(
            res,
            { user: user, accessToken: newAccessToken },
            'login successfully',
            globalConstants.statusCode.HttpsStatusCodeCreated.code,
          );
        } else {
          this.redirect(req, res, 'google');
        }
      }
    } catch (err) {
      next(err);
    }
  };

  public createNewAccountHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = (await this.AuthService.createNewAccount(req.body)) as User;
      const newRefreshToken = await setRefreshToken({
        email: newUser.email,
        userId: newUser.userId,
      });
      const newAccessToken = await setAccessToken({
        email: newUser.email,
        userId: newUser.userId,
      });
      await this.RefreshAccessTokenService.addRefreshToken(newUser.userId, newRefreshToken);

      res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: getConfig().JWT_REFRESH_TOKEN_COOKIE_EXPIRATION,
      });

      this.send(
        res,
        { user: newUser, accessToken: newAccessToken },
        'Account created successfully',
        globalConstants.statusCode.HttpsStatusCodeCreated.code,
      );
    } catch (err) {
      next(err);
    }
  };

  public logoutHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookie = req.cookies;
      if (!cookie?.jwt) {
        this.send(res, null, 'logout successfully');
        return;
      }

      const refreshToken = cookie.jwt;

      const user = await this.RefreshAccessTokenService.findUserBasedOnRefreshToken(refreshToken);
      logger.debug('loggegdjh');
      if (!user) {
        res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });
        this.send(res, null, 'logout successfully');
        return;
      }
      await this.RefreshAccessTokenService.removeRefreshToken(user.userId, refreshToken);

      res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });
      this.send(res, null, 'logout successfully');
    } catch (err) {
      next(err);
    }
  };
}
