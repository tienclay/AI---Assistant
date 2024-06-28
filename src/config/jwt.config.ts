export const jwtConfig = {
  secret: process.env.JWT_SECRET_KEY || '123456',
  signOptions: {
    expiresIn: parseInt(process.env.JWT_EXPIRED_IN, 10) || 600,
  },
};
