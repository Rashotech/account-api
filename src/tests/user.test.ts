import request from "supertest";
import app from "../app";
import setupTestDB from "./utils/setupTestDB";
import httpStatus from 'http-status';
import { UserInterface } from '../interfaces/UserInterface';
import User from './fixtures/user.fixture';
import { userOneAccessToken, userTwoAccessToken } from './fixtures/token.fixture'


// Set up Test Database
setupTestDB();

describe('Auth routes', () => {
  describe('POST /api/auth/register', () => {
    let newUser: UserInterface;
    beforeEach(() => {
      newUser = {
        email: "rashotech2@gmail.com",
        password: "test1245678",
        first_name: "Rasheed",
        last_name: "Ayoade",
        phone_number: "08133166978"
      };
    });

    test('should return 201 and successfully register user if request data is ok', async () => {
      const res = await request(app).post('/api/auth/register').send(newUser).expect(httpStatus.CREATED);

      expect(res.body.user).toEqual({
          id: expect.anything(),
          email: "rashotech2@gmail.com",
          first_name: "Rasheed",
          last_name: "Ayoade",
          phone_number: "08133166978",
          created_at: expect.anything()
      });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });

    test('should return 400 error if email is already used', async () => {
      await User.insertUsers([User.userOne]);
      newUser.email = User.userOne.email;

      await request(app).post('/api/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 422 error if email is invalid', async () => {
      newUser.email = 'invalidEmail';

      await request(app).post('/api/auth/register').send(newUser).expect(httpStatus.UNPROCESSABLE_ENTITY);
    });

    test('should return 422 error if password length is less than 8 characters', async () => {
      newUser.password = 'passwo1';

      await request(app).post('/api/auth/register').send(newUser).expect(httpStatus.UNPROCESSABLE_ENTITY);
    });

    test('should return 422 error if password does not contain both letters and numbers', async () => {
      newUser.password = 'password';

      await request(app).post('/api/auth/register').send(newUser).expect(httpStatus.UNPROCESSABLE_ENTITY);

      newUser.password = '11111111';

      await request(app).post('/api/auth/register').send(newUser).expect(httpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('POST /api/auth/login', () => {
    test('should return 200 and login user if email and password match', async () => {
      await User.insertUsers([User.userOne]);
      const loginCredentials = {
        email: User.userOne.email,
        password: User.userOne.password,
      };
  
      const res = await request(app).post('/api/auth/login').send(loginCredentials).expect(httpStatus.OK);
  
      expect(res.body.user).toEqual({
        id: expect.anything(),
        email: User.userOne.email,
        first_name: User.userOne.first_name,
        last_name: User.userOne.last_name,
        phone_number: User.userOne.phone_number,
        created_at: expect.anything()
      });
  
      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });
  
    test('should return 401 error if password is wrong', async () => {
      await User.insertUsers([User.userOne]);
      const loginCredentials = {
        email: User.userOne.email,
        password: 'wrongPassword1',
      };
  
      const res = await request(app).post('/api/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);
  
      expect(res.body).toEqual({ code: httpStatus.UNAUTHORIZED, message: 'Incorrect credentials' });
    });
  });
});

