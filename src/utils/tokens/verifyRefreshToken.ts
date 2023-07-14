import jwt, { SignOptions } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { Payload } from '@/utils';
import { HttpExceptionError } from '@/exceptions/http.exception';
import { globalConstants } from '@/lib/constants';

const publicRefreshTokenKeyPath = path.resolve(__dirname, '..', '..', 'keys', 'refreshToken', 'public.key');

export async function verifyRefreshToken(token: string): Promise<Payload> {
  try {
    const publicKey = await fs.promises.readFile(publicRefreshTokenKeyPath, 'utf8');

    const options: SignOptions = {
      algorithm: 'RS256',
      issuer: 'AudioLounge',
    };
    const decoded = jwt.verify(token, publicKey, options) as Payload;
    return decoded;
  } catch (err) {
    throw new HttpExceptionError(
      globalConstants.statusCode.ForbiddenException.code,
      `Failed to verify JWT: ${(err as Error).message}`,
    );
  }
}
