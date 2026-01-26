import bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};


const isPasswordValid = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};


export default {
    hashPassword,
    isPasswordValid
};