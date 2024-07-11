import { registerAs } from '@nestjs/config';
import { format, transports, Logform } from 'winston';

const formatter = (): Logform.Format => {
  return format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  );
};

export default registerAs('log', () => ({
  transports: [
    new transports.Console({
      format: formatter(),
      level: process.env.LOG_LEVEL || 'info',
      silent: process.env.NODE_ENV === 'test',
    }),
  ],
}));
