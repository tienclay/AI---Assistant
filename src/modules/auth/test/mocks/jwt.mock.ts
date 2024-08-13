import { mockAccessToken } from './token.mock';

export const mockJwtService = {
  sign: jest.fn().mockReturnValue(mockAccessToken),
};
