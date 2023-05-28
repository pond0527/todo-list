import { TodoListJsonData, TodoFormType } from 'types/todo/type.d';
import { ApiResoinse } from 'types/api/type.d';
import { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'node:fs/promises';
import { TODO_LIST_FILEPATH, getTodoList } from '../todo';

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResoinse<boolean>>) => {
    console.log(req.query, req.body);
    const { todoId } = req.query;
    if (req.method === 'POST') {
        const result = await createTodoList(Number(todoId), JSON.parse(req.body) as TodoFormType);
        res.status(200).json({data: result});
    } else {
        res.status(403);
    }
};

const createTodoList = async (todoId: number, todo: TodoFormType) => {
    const todoList = await getTodoList();
    const otherTodo = todoList.filter(o => o.id !== todoId);
    if(todoList.length > otherTodo.length) {
        // データ不正
        console.warn(`${todoId} is conflict to override`);
    }

    todoList.push({
        ...todo,
        id: todoId,
        createAt: new Date(),
    } as TodoListJsonData);

    try {
        fs.writeFile(TODO_LIST_FILEPATH, JSON.stringify(todoList));
        return true;
    } catch (e: any) {
        console.log(e);
        return false;
    }
};

export default handler;
