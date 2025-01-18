import { format } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResoinse } from 'types/api/type.d';
import userRepository from 'ports/user-repository';
import { User } from 'types/mysql/user';
import { UserFormType } from 'types/user/type';
import { ulid } from 'ulid';
import { passwordToHash } from 'domain/user/password';
import logger from 'lib/logger';

export default async function signup(
    req: NextApiRequest,
    res: NextApiResponse<ApiResoinse<boolean>>,
) {
    if (req.method === 'POST') {
        // ユーザー登録
        const form = JSON.parse(req.body) as UserFormType;

        const allUser = await userRepository.fetchAll();
        const existsUser = allUser.some(u => u.name === form.name);
        if(existsUser) {
            logger.warn('exists user');
            res.status(400);
            return;
        }

        const [hash, salt] = passwordToHash(form.password);
        const registData = {
            user_id: ulid(),
            name: form.name,
            password: hash, // 暗号化
            salt: salt,
            created_at: format(new Date(), 'yyyy-MM-dd HH-mm-ss'),
            updated_at: format(new Date(), 'yyyy-MM-dd HH-mm-ss'),
        } as User;

        const isSuccess = await userRepository.register(registData);
        res.status(200).json({ data: isSuccess });
    } else {
        res.status(405);
    }
}

