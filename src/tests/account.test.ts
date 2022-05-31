import request from "supertest";
import app from "../app";
import setupTestDB from "./utils/setupTestDB";
import httpStatus from 'http-status';
import User from './fixtures/user.fixture';
import { userOneAccessToken, userTwoAccessToken } from './fixtures/token.fixture'

// Set up Test Database
setupTestDB();

describe('Account routes', () => {
  describe('POST /api/account', () => {
    test('should return 201 and successfully create an account for a user if token is valid', async () => {
        await User.insertUsers([User.userOne]);
        const res = await request(app)
            .post('/api/account/create')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.CREATED);

        expect(res.body.message).toEqual("Account Created Successfully");
    });
  });

  describe('GET /api/account', () => { 
    test('should return 200 after fetching all accounts owned by a user', async () => {
        await User.insertUsers([User.userOne]);
        await User.createAccount([User.userOne]);
  
        const res = await request(app)
            .get('/api/account/list')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);
  
        expect(res.body.message).toEqual("Accounts Fetched Successfully");
    });

    test('should return 200 after getting the balance of account of a user', async () => {
        await User.insertUsers([User.userOne]);
        await User.createAccount([User.userOne]);
  
        const res = await request(app)
            .get(`/api/account/${User.accountNumbers[0]}/balance`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);
  
        expect(res.body.message).toEqual("Account Details Fetched Successfully");
    });
  });

  describe('POST /api/account/fund', () => { 
    test('should return 200 after funding an account', async () => {
        await User.insertUsers([User.userOne]);
        await User.createAccount([User.userOne]);

        const res = await request(app)
            .post('/api/account/fund')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send({
                "amount": 5000,
                "account_number": User.accountNumbers[0]
            })
            .expect(httpStatus.OK);
  
        expect(res.body.message).toEqual("Account Funded Successfully");
    });

    test('should return 401 when trying to fund another person account', async () => {
        await User.insertUsers([User.userOne]);
        await User.createAccount([User.userOne]);

        const res = await request(app)
            .post('/api/account/fund')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send({
                "amount": 5000,
                "account_number": User.accountNumbers[1]
            })
            .expect(httpStatus.UNAUTHORIZED);
  
        expect(res.body.message).toEqual("UnAuthorized");
    });
  });

  describe('POST /api/account/withdraw', () => { 
    test('should return 200 after withdrawing from an account', async () => {
        await User.insertUsers([User.userOne]);
        await User.createAccount([User.userOne]);

        await request(app)
            .post('/api/account/fund')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send({
                "amount": 5000,
                "account_number": User.accountNumbers[0]
            })
            .expect(httpStatus.OK);

        const res = await request(app)
        .post('/api/account/withdraw')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({
            "amount": 4000,
            "account_number": User.accountNumbers[0]
        })
        .expect(httpStatus.OK);
  
        expect(res.body.message).toEqual("Fund Withdawal Successful");
    });

    test('should return 200 when trying to withdraw more than the available balance', async () => {
        await User.insertUsers([User.userOne]);
        await User.createAccount([User.userOne]);

        const res = await request(app)
            .post('/api/account/withdraw')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send({
                "amount": 5000,
                "account_number": User.accountNumbers[0]
            })
            .expect(httpStatus.OK);
  
        expect(res.body.message).toEqual("Insufficient Balance");
    });
  });

  describe('POST /api/account/transfer', () => { 
    test('should return 200 after transfering less than account balance to another account', async () => {
        await User.insertUsers([User.userOne, User.userTwo]);
        await User.createAccount([User.userOne, User.userTwo]);

        await request(app)
            .post('/api/account/fund')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send({
                "amount": 5000,
                "account_number": User.accountNumbers[0]
            })
            .expect(httpStatus.OK);

        const res = await request(app)
            .post('/api/account/transfer')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send({
                "amount": 4000,
                "account_number": User.accountNumbers[0],
                "beneficiary_account": User.accountNumbers[1]
            })
            .expect(httpStatus.OK);
  
        expect(res.body.message).toEqual("Fund Transfer Successful");
    });

    test('should return 404 after transferring to account that does not exist', async () => {
        await User.insertUsers([User.userOne]);
        await User.createAccount([User.userOne]);

        await request(app)
            .post('/api/account/fund')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send({
                "amount": 5000,
                "account_number": User.accountNumbers[0]
            })
            .expect(httpStatus.OK);

        const res = await request(app)
        .post('/api/account/transfer')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({
            "amount": 4000,
            "account_number": User.accountNumbers[0],
            "beneficiary_account": User.accountNumbers[1]
        })
        .expect(httpStatus.NOT_FOUND);
  
        expect(res.body.message).toEqual("Recipient account does not exist or cannot receive funds");
    });

    test('should return 200 when trying to transfer more than the available balance', async () => {
        await User.insertUsers([User.userOne, User.userTwo]);
        await User.createAccount([User.userOne, User.userTwo]);

        await request(app)
            .post('/api/account/fund')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send({
                "amount": 5000,
                "account_number": User.accountNumbers[0]
            })
            .expect(httpStatus.OK);

        const res = await request(app)
        .post('/api/account/transfer')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({
            "amount": 40000,
            "account_number": User.accountNumbers[0],
            "beneficiary_account": User.accountNumbers[1]
        })
        .expect(httpStatus.OK);
  
        expect(res.body.message).toEqual("Insufficient Balance");
    });
  });

  describe('GET /api/account/transactions', () => { 
    test('should return 200 after getting account transactions', async () => {
        await User.insertUsers([User.userOne, User.userTwo]);
        await User.createAccount([User.userOne, User.userTwo]);

        await request(app)
            .post('/api/account/fund')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send({
                "amount": 5000,
                "account_number": User.accountNumbers[0]
            })
            .expect(httpStatus.OK);

        await request(app)
            .post('/api/account/transfer')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send({
                "amount": 4000,
                "account_number": User.accountNumbers[0],
                "beneficiary_account": User.accountNumbers[1]
            })
            .expect(httpStatus.OK);

        const res = await request(app)
            .get(`/api/account/${User.accountNumbers[0]}/transactions`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);
  
        expect(res.body.message).toEqual("Transaction details Fetched Successfully");
    });
  });
});

