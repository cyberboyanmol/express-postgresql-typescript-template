import crypto from 'crypto';
import argon2 from 'argon2';

export class OtpService {
  public async otpGenerator() {
    const newotp: number = crypto.randomInt(100000, 999999);
    return newotp;
  }

  public async hashGenerator(data: string) {
    const salt = crypto.randomBytes(64);

    const valueWithSecret = (data + process.env.ARGON_SECRET_PEPPER) as string;
    const otphashed = await argon2.hash(valueWithSecret, { salt });
    return otphashed;
  }

  public async verifyHash(otphashed: string, data: string) {
    const valueWithSecret = (data + process.env.ARGON_SECRET_PEPPER) as string;
    const isValid = await argon2.verify(otphashed, valueWithSecret);
    // logger.info(`Verified ${valueWithSecret} ${isValid}`);
    return isValid;
  }
}
