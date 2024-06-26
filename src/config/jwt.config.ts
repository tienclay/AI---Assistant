export const jwtConfig = {
  secret: process.env.JWT_SECRET_KEY || '123456',
  signOptions: {
    expiresIn: parseInt(process.env.expiresIn, 10) || 600,
  },
};
