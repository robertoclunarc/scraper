import dotenv from 'dotenv';
dotenv.config();
const host = process.env.MYSQL_SERVER;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PW;
const namedatabase = process.env.MYSQL_DB;
const port = process.env.MYSQL_PORT;
const conLimit= 10;

const key = {
    host: host,
    database: namedatabase,
    user: user,
    password: password,
    port:port,
    connectionLimit: conLimit
}

export {key};