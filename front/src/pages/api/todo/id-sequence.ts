import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResoinse } from 'types/api/type';
import * as fs from 'node:fs/promises';
import { join } from 'path';
import { getTodoList } from '../todo';

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

        var loadedTodoId = Number(text.toString().split('\n')[0]);
        console.log(`loadedTodoId: [${loadedTodoId}]`);

        const todoList = await getTodoList();
        let latestTodoId = loadedTodoId;
        if (todoList.find((o) => loadedTodoId === o.id)) {
            // 保管しているIDが使用中の場合はインクリメント
            latestTodoId = loadedTodoId + 1;
        }

        save(latestTodoId);
        return Promise.resolve(latestTodoId);
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
