import { ApiResoinse } from 'types/api/type';
import { TodoListJsonData } from 'types/todo/type';

export const getTodoList = async (): Promise<TodoListJsonData[]> => {
    const response = await fetch(`http://localhost:3000/api/todo`, {
        method: 'GET',
    });

    const responseBody = (await response.json()) as ApiResoinse<
        TodoListJsonData[]
    >;

    console.log('responseBody', responseBody);

    return parsedTodoList(responseBody.data);
};

export const getTodo = async (todoId: string): Promise<TodoListJsonData> => {
    const response = await fetch(`http://localhost:3000/api/todo/${todoId}`, {
        method: 'GET',
    });

    const responseBody =
        (await response.json()) as ApiResoinse<TodoListJsonData>;

    return parsedTodo(responseBody.data);
};

const parsedTodoList = (todoList: TodoListJsonData[]) =>
    todoList.map(parsedTodo);

const parsedTodo = (todo: TodoListJsonData) => {
    // const parsedTodo = { ...todo };
    const parsedTodo = { ...todo, createAt: new Date(todo.createAt) };
    if (todo.updateAt) {
        parsedTodo.updateAt = new Date(todo.updateAt);
    }

    return parsedTodo;
};
