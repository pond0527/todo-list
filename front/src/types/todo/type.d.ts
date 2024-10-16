export type TodoFormType = Pick<
    TodoListJsonData,
    'todoId' | 'title' | 'status' | 'assignment' | 'detail'
>;

export type TodoListJsonData = {
    todoId?: string;
    title: string;
    status: string;
    assignment: string;
    detail: string;
    createAt: Date;
    updateAt: Date;
};

export type Member = {
    id: string;
    name: string;
};

export type Status = {
    id: string;
    label: string;
};
