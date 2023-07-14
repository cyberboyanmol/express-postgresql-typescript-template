import { AuthController } from './controllers/auth.controller';
import { Router } from 'express';
import type { Route } from '../../interfaces/route.interface';
import { ValidationPipe } from '../../middlewares/request-validation.middleware';
import { AuthDto } from './dtos/auth.dto';
import { VerifyOtpDto } from './dtos/verifyotp.dto';
import { GoogleController } from './controllers/google.controller';
import { RefreshAccessToken } from './controllers/refreshAccessToken.controller';
import { isAuthenticated } from '../../middlewares/auth.middleware';

export class AuthRoute implements Route {
  public readonly path = '/auth';
  public router = Router();
  public authController = new AuthController();
  public googleController = new GoogleController();
  public refreshAccessToken = new RefreshAccessToken();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(`${this.path}/login`, ValidationPipe(AuthDto), this.authController.EmailSignUpHandler);

    this.router.post(`${this.path}/verify`, ValidationPipe(VerifyOtpDto), this.authController.VerifyOtpHandler);

    this.router.get(`${this.path}/refresh-token`, this.refreshAccessToken.refreshAccessTokenHandler);

    this.router.get(`${this.path}/logout`, isAuthenticated, this.authController.logoutHandler);

    this.router.get(`${this.path}/google`, this.googleController.signInWithgoogle);
  }
}
