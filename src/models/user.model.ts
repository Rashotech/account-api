import db from "../config/db";
import bcrypt from 'bcrypt';

const createNewUser = async (option: any) => {
  return await db('users').insert(option)
};

const getUsers = async () => {
    return db('users').select()
}
  
const findUser = async(id: number) => {
  return await db('users').where('id', id).first()
}

const findUserByEmail = async(email: string) => {
  return await db('users').where('email', email).first()
}

const updateUser = async (id: number, option: any) => {
  return db('users').where('id', id).update(option)
}

const isPasswordMatch = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  return bcrypt.compare(password, user.password);
};

const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 8);
};

export {
  createNewUser,
  getUsers,
  findUser,
  findUserByEmail,
  isPasswordMatch,
  updateUser,
  hashPassword
}