import jwt, { SignOptions } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import { Payload } from '@/utils';
import { getConfig } from '@/config';

const privateAccessKeyPath = path.resolve(__dirname, '..', '..', 'keys', 'accessToken', 'private.key');

export const setAccessToken = async (payload: Payload): Promise<string> => {
  try {
    const privateKey = await fs.promises.readFile(privateAccessKeyPath, 'utf8');

    const options: SignOptions = {
      algorithm: 'RS256',
      expiresIn: getConfig().JWT_ACCESS_TOKEN_EXPIRATION,
      issuer: 'AudioLounge',
      audience: `user_id-${payload.userId}`,
      subject: 'accessToken',
    };

    const accessToken = jwt.sign(payload, privateKey, options);
    return accessToken;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
