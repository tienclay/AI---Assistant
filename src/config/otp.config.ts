import * as dotenv from 'dotenv';
dotenv.config();

export const otpConfig = {
  otp_expire_time: process.env.OTP_EXPIRE_TIME
    ? parseInt(process.env.OTP_EXPIRE_TIME, 10)
    : 60,
  otp_resend_time: process.env.OTP_RESEND_TIME
    ? parseInt(process.env.OTP_RESEND_TIME, 10)
    : 60,
  otp_length: process.env.OTP_LENGTH ? parseInt(process.env.OTP_LENGTH, 10) : 4,
  max_submission_remaining: process.env.MAX_SUBMISSION_REMAINING
    ? parseInt(process.env.MAX_SUBMISSION_REMAINING, 10)
    : 3,
  locked_account_1h: process.env.LOCKED_ACCOUNT_TIME_1H
    ? parseInt(process.env.LOCKED_ACCOUNT_TIME_1H, 10)
    : 3600,
  locked_account_24h: process.env.LOCKED_ACCOUNT_TIME_24H
    ? parseInt(process.env.LOCKED_ACCOUNT_TIME_24H, 10)
    : 86400,
};
