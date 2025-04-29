import { TodoStatus } from 'constants/todo/status';

export type TodoFormType = Pick<
    TodoJsonData,
    | 'todoId'
    | 'title'
    | 'status'
    | 'assignmentMemberId'
    | 'detail'
    | 'isWarning'
>;

export type TodoStatusType = keyof typeof TodoStatus;

export type TodoJsonData = {
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
    isDeleted: boolean;
};

export type MemberFormType = MemberApiData;