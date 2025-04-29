import bcrypt from 'bcrypt';
import logger from 'lib/logger';

const USER_PEPER = process.env.USER_PEPER;
const SALT_ROUND = 10;

export const passwordToHash = (password: string) : [string, string] => {
    const salt = bcrypt.genSaltSync(SALT_ROUND);
    logger.info("salt: " + salt);
    return [bcrypt.hashSync(`${password}.${USER_PEPER}`, salt), salt];
}

export const passwordCompare = (password: string, hash: string) : boolean => {
    return bcrypt.compareSync(`${password}.${USER_PEPER}`, hash);
}