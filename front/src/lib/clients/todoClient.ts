import { ApiResoinse } from 'types/api/type';
import { TodoListJsonData } from 'types/todo/type';

export const getTodoList = async (): Promise<TodoListJsonData[]> => {
    const response = await fetch(`http://localhost:3000/api/todo`, {
        method: 'GET',
    });

    const responseBody = (await response.json()) as ApiResoinse<
        TodoListJsonData[]
    >;

    return responseBody.data;
};

export const getTodo = async (todoId: string): Promise<TodoListJsonData> => {
    const response = await fetch(
        `http://localhost:3000/api/todo/${todoId}`,
        {
            method: 'GET',
        },
    );

    const responseBody =
        (await response.json()) as ApiResoinse<TodoListJsonData>;
    return responseBody.data;
};

export const createTodoId = async (): Promise<number> => {
    const response = await fetch(
        `http://localhost:3000/api/todo/id-sequence`,
        {
            method: 'POST',
        },
    );

    const responseBody =
        (await response.json()) as ApiResoinse<number>;

    return responseBody.data;
}