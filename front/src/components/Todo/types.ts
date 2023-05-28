export type TodoFormType = Pick<
    TodoListJsonData,
    'title' | 'status' | 'assignment' | 'detail'
>;

export type TodoListJsonData = {
    id: number;
    title: string;
    status: '0' | '1' | '2' | '3' | '4';
    assignment: string;
    detail: string;
    createAt: Date;
    updateAt?: Date;
};

export type ApiResoinse<T> = {
    data: T;
};
