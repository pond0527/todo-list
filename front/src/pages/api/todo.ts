import { TodoListJsonData, ApiResoinse } from 'components/Todo/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'path';
import * as fs from 'node:fs/promises';

export const TODO_LIST_FILEPATH = join(process.cwd(), 'share/todo-list.json');
console.log(TODO_LIST_FILEPATH);

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResoinse<TodoListJsonData[]>>) => {
    if (req.method === 'GET') {
        const todoList = await getTodoList();
        console.log("Get: todoList, ",todoList);
        JSON.stringify({data: todoList})
        res.status(200).send({data: todoList})
    } else {
        res.status(403);
    }
};

export const getTodoList = async (): Promise<TodoListJsonData[]> => {
    try {
        const data = await fs.readFile(TODO_LIST_FILEPATH, {encoding: 'utf-8'});
        const todoList = JSON.parse(data) as TodoListJsonData[];
        return Promise.resolve(todoList);
    } catch (e: any) {
        return Promise.resolve([]);
    }
};

export default handler;
