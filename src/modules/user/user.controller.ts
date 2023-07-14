import { NextFunction, Request, RequestHandler, Response } from 'express';
import Api from '@/lib/api';
import { UserService } from './user.service';
import { HttpExceptionError } from '@/exceptions/http.exception';
import { globalConstants } from '@/lib/constants';
import { MailService } from '@/lib/mailer.service';
import { sendMail } from '@/interfaces';
import { logger } from '@/lib/logger';

export class UserController extends Api {
  private readonly userServie: UserService;
  private readonly mailService: MailService;
  constructor() {
    super();
    this.userServie = new UserService();
    this.mailService = new MailService();
  }

  public getMyProfileHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new HttpExceptionError(
          globalConstants.statusCode.UnauthorizedException.code,
          ' Unauthorized login first !',
        );
      }
      const user = await this.userServie.getProfile(req.user.userId);
      this.send(res, user, 'Your profile details');
    } catch (err) {
      next(err);
    }
  };

  public activateMyProfileHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user;
      const updateUser = await this.userServie.updateUser(userId, req.body);

      logger.debug(`User ${updateUser.email}`);

      const templateData = {
        name: updateUser.name as string,
        imageUrl: 'https://i.imgur.com/twND8zP.png',
      };

      const mailData: sendMail = {
        templateName: 'Welcome',
        recipientEmail: updateUser.email as string,
        subject: 'Welcome to AudioLounge! Join the audio revolution 🎧🌟',
        templateData,
        EventType: '',
      };
      this.mailService.sendMail(mailData);
      this.send(res, updateUser, 'Your profile successfully activated');
    } catch (err) {
      next(err);
    }
  };
}
