import { TodoListJsonData, TodoFormType } from 'types/todo/type.d';
import { ApiResoinse } from 'types/api/type.d';
import { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'node:fs/promises';
import { TODO_LIST_FILEPATH, getTodoList } from '../todo';


const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiResoinse<boolean|TodoListJsonData>>,
) => {
    console.log(req.query, req.body);
    const { todoId } = req.query;
    if (req.method === 'POST') {
        const result = await upsertTodo(
            Number(todoId),
            JSON.parse(req.body) as TodoFormType,
        );
        res.status(200).json({ data: result });
    } else if (req.method === 'GET') {
        const todoList = await getTodoList();
        const todo = todoList.find((o) => o.id === Number(todoId));
        if(todo) {
            res.status(200).json({data: todo});
        } else {
            res.status(400);
        }
    } else if (req.method === 'DELETE') {
        const result = await deleteTodo(Number(todoId));
        res.status(200).json({ data: result });
    } else {
        res.status(403);
    }
};

const upsertTodo = async (todoId: number, todoForm: TodoFormType) => {
    const todoList = await getTodoList();
    const matchedTargetTodo = todoList.find((o) => o.id === todoId);
    let todo: TodoListJsonData;
    if (matchedTargetTodo) {
        // 存在するデータは上書きするので警告しておく
        console.warn(`${todoId} is conflict to override`);
        todo = { ...matchedTargetTodo, ...todoForm, updateAt: new Date() };
    } else {
        todo = { ...todoForm, id: todoId, createAt: new Date() };
    }

    const updateTodoList: TodoListJsonData[] = todoList
        .filter((o) => o.id !== todoId)
        .concat([todo]);

    return save(updateTodoList);
};

const deleteTodo = async (todoId: number) => {
    const todoList = await getTodoList();
    return save(todoList.filter((o) => o.id !== todoId));
};

const save = (todoList: TodoListJsonData[]): boolean => {
    try {
        fs.writeFile(TODO_LIST_FILEPATH, JSON.stringify(todoList));
        return true;
    } catch (e: any) {
        console.log(e);
        return false;
    }
};


export default handler;