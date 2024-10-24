import { Member } from 'types/todo/type.d';
import { ApiResoinse } from 'types/api/type.d';
import { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'path';
import * as fs from 'node:fs/promises';
import logger from 'lib/logger';

export const MEMBER_LIST_FILEPATH = join(
    process.cwd(),
    'share/member-list.json',
);
console.log(MEMBER_LIST_FILEPATH);

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiResoinse<Member[]>>,
) => {
    if (req.method === 'GET') {
        const memberList = await getMemberList();
        logger.info({ memberList: memberList }, 'Get: memberList, ');

        JSON.stringify({ data: memberList });
        res.status(200).send({ data: memberList });
    } else {
        res.status(403);
    }
};

const getMemberList = async (): Promise<Member[]> => {
    try {
        const data = await fs.readFile(MEMBER_LIST_FILEPATH, {
            encoding: 'utf-8',
        });
        const list = JSON.parse(data) as Member[];
        return Promise.resolve(list);
    } catch (e: any) {
        return Promise.resolve([]);
    }
};

export default handler;
