export * from './otp.service';
export * from './tokens';

interface Payload {
  userId: string;
  email: string;
}

interface DecodedToken {
  userId: string;
}

export { DecodedToken, Payload };
