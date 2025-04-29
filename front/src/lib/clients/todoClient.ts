import { ApiResoinse } from 'types/api/type';
import { TodoJsonData } from 'types/todo/type';

export const getTodoList = async (): Promise<TodoJsonData[]> => {
    const response = await fetch(`http://localhost:3000/api/todo`, {
        method: 'GET',
    });

    const responseBody = (await response.json()) as ApiResoinse<
        TodoJsonData[]
    >;

    console.log('responseBody', responseBody);

    return parsedTodoList(responseBody.data);
};

export const getTodo = async (todoId: string): Promise<TodoJsonData> => {
    const response = await fetch(`http://localhost:3000/api/todo/${todoId}`, {
        method: 'GET',
    });

    const responseBody =
        (await response.json()) as ApiResoinse<TodoJsonData>;

    return parsedTodo(responseBody.data);
};

const parsedTodoList = (todoList: TodoJsonData[]) =>
    todoList.map(parsedTodo);

const parsedTodo = (todo: TodoJsonData) => {
    // const parsedTodo = { ...todo };
    const parsedTodo = { ...todo, createAt: new Date(todo.createAt) };
    if (todo.updateAt) {
        parsedTodo.updateAt = new Date(todo.updateAt);
    }

    return parsedTodo;
};
