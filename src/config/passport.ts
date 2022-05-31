import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import db from './db';
import { config } from 'dotenv';
import { UserInterface } from '../interfaces/UserInterface';
config();

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify = async (payload: any, done: (opt: any, type: Boolean | UserInterface) => any) => {
  try {
    const user = await db('users').select().where({ id: payload.sub }).first();
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;

