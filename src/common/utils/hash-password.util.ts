import * as bcrypt from 'bcrypt';

export async function hashPassword(password): Promise<string> {
  const salt = await bcrypt.genSalt();
  const hashPassword = bcrypt.hash(password, salt);
  return hashPassword;
}
