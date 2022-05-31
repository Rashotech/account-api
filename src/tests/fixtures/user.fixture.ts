import bcrypt from 'bcrypt';
import db from '../../config/db';

const password = 'test1245678';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);
const accountNumbers = ["5346768333", "9954345473", "4356789079"];

const userOne = {
    id: 1,
    email: "test1@gmail.com",
    first_name: "Test1 Name",
    last_name: "Test1 last",
    phone_number: "080882762727",
    password
};

const userTwo = {
    id: 2,
    email: "test2@gmail.com",
    first_name: "Test2 Name",
    last_name: "Test2 last",
    phone_number: "080882762726",
    password
};

const insertUsers = async (users: any[]) => {
    await db('users').insert(users.map((user) => ({ ...user, password: hashedPassword })))
};

const createAccount = async (users: any[]) => {
    await db('account').insert(users.map((user, i) => ({ user_id: user.id, account_number: accountNumbers[i] })))
};

export default {
  userOne,
  userTwo,
  accountNumbers,
  insertUsers,
  createAccount
};