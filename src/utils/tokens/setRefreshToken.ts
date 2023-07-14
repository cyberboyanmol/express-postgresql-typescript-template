import jwt, { SignOptions } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { Payload } from '@/utils';
import { getConfig } from '@/config';


const privateRefreshKeyPath = path.resolve(__dirname, '..', '..', 'keys', 'refreshToken', 'private.key');

export const setRefreshToken = async (payload: Payload): Promise<string> => {
  try {
    const privateKey = await fs.promises.readFile(privateRefreshKeyPath, 'utf8');
    const options: SignOptions = {
      algorithm: 'RS256',
      expiresIn: getConfig().JWT_REFRESH_TOKEN_EXPIRATION,
      audience: `user_id-${payload.userId}`,
      subject: 'refreshToken',
      issuer: 'AudioLounge',
    };

    const refreshToken = jwt.sign(payload, privateKey, options);
    return refreshToken;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
