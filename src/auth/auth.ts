import { BangUser } from '../utils/typeorm';
import { PayloadgenerateToken, ValidateUserDetails } from '../utils/types';

export interface IAuthService {
  validateUser(userCredentials: ValidateUserDetails): Promise<BangUser | null>;
  generateToken(userName: PayloadgenerateToken): Promise<any>;
  validateToken(token: string): Promise<any>;
}
