import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function hashPassword(rawPassword: string) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(rawPassword, salt);
}

export async function compareHash(rawPassword: string, hashedPassword: string) {
  const isPassWord = await bcrypt.compare(rawPassword, hashedPassword);
  if (isPassWord) return isPassWord;
}

export const generateUUIDV4 = () => uuidv4();
