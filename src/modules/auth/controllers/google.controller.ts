import { NextFunction, Request, RequestHandler, Response } from 'express';
import Api from '@/lib/api';

export class GoogleController extends Api {
  constructor() {
    super();
  }

  public signInWithgoogle: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
      this.send(res, null, 'google handler');
    } catch (err) {
      next(err);
    }
  };
}
