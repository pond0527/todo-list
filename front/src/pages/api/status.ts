import { Status } from 'types/todo/type.d';
import { ApiResoinse } from 'types/api/type.d';
import { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'path';
import * as fs from 'node:fs/promises';
import logger from 'lib/logger';

export const STATUS_LIST_FILEPATH = join(
    process.cwd(),
    'share/status-list.json',
);
console.log(STATUS_LIST_FILEPATH);

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiResoinse<Status[]>>,
) => {
    if (req.method === 'GET') {
        const statusList = await getStatusList();
        logger.info({ statusList: statusList }, 'Get: statusList, ');
        JSON.stringify({ data: statusList });
        res.status(200).send({ data: statusList });
    } else {
        res.status(403);
    }
};

const getStatusList = async (): Promise<Status[]> => {
    try {
        const data = await fs.readFile(STATUS_LIST_FILEPATH, {
            encoding: 'utf-8',
        });
        const list = JSON.parse(data) as Status[];
        return Promise.resolve(list);
    } catch (e: any) {
        return Promise.resolve([]);
    }
};

export default handler;
