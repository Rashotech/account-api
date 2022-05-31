import dotenv from 'dotenv';
dotenv.config();

const configs = {
    jwt: {
        secret: process.env.JWT_SECRET!,
        access_expiry: process.env.JWT_ACCESS_EXPIRATION_MINUTES!,
        refresh_expiry: process.env.JWT_REFRESH_EXPIRATION_DAYS!,
    },
    db: {
        development: process.env.DB_DATABASE!,
        production: process.env.DB_DATABASE!,
        test: process.env.DB_DATABASE_TEST!,
        host : process.env.DB_HOST!,
        port : 3306,
        user : process.env.DB_USERNAME!,
        password : process.env.DB_PASSWORD!
    },
    env: process.env.NODE_ENV!
}

export default configs;