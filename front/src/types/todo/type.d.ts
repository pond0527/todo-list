export type TodoFormType = Pick<
    TodoListJsonData,
    | 'todoId'
    | 'title'
    | 'status'
    | 'assignmentMemberId'
    | 'detail'
    | 'isWarning'
>;

export const TodoStatus = {
    Open: 'Open',
    Doing: 'Doing',
    Pending: 'Pending',
    Done: 'Done',
} as const;

export type TodoStatusType = keyof typeof TodoStatus;

export type TodoListJsonData = {
    todoId?: string;
    title: string;
    status: TodoStatusType;
    isWarning: boolean;
    assignmentMemberId: string;
    detail: string;
    createAt: Date;
    updateAt: Date;
};

export type MemberApiData = {
    memberId: string;
    name: string;
};
