import { UserRole } from 'src/common/enums';

export const NOVU_QUEUE_NAME = 'novu';
export const NOVU_QUEUE_JOBS = {
  IDENTIFY_NOVU: 'identify-novu',
  SEND_OTP_LOGIN: 'otp-mail',
  SEND_ACCOUNT_VERIFICATION_SUCCESS:
    'talent-scout-account-verification-success',
};

export interface UserMetadataPayload {
  role: UserRole;
}

export interface AuthIdentifyData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  metadata: UserMetadataPayload;
}

export interface OTPLoginJobData {
  userId: string;
  email: string;
  otp: string;
}

export interface AccountVerificationData {
  userId: string;
  email: string;
  userName: string;
}
