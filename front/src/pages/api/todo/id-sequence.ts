import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResoinse } from 'types/api/type';
import * as fs from 'node:fs/promises';
import { join } from 'path';

export const TODO_ID_SEQUENCE_FILEPATH = join(
    process.cwd(),
    'share/todo-id-sequence.txt',
);
console.log(TODO_ID_SEQUENCE_FILEPATH);

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiResoinse<number>>,
) => {
    if (req.method === 'POST') {
        const newId = await getNewTodoId();
        save(newId);
        res.status(200).json({ data: newId });
    } else {
        res.status(403);
    }
};

export default handler;

const getNewTodoId = async (): Promise<number> => {
    try {
        const text = await fs.readFile(TODO_ID_SEQUENCE_FILEPATH, {
            encoding: 'utf-8',
        });
        var todoId = text.toString().split('\n')[0];
        console.log(`todoId: [${todoId}]`);
        return Promise.resolve(Number(todoId) + 1);
    } catch (e: any) {
        return Promise.reject(Error('failed getting todoId'));
    }
};

const save = (newId: number): boolean => {
    try {
        fs.writeFile(TODO_ID_SEQUENCE_FILEPATH, newId.toString());
        return true;
    } catch (e: any) {
        console.log(e);
        return false;
    }
};
