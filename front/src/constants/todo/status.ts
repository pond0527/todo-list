import { SelectOutput } from 'types/form';

export const TodoStatus = {
    Open: 'Open',
    Doing: 'Doing',
    Pending: 'Pending',
    Done: 'Done',
} as const;

export const TODO_STATUS_LIST: Array<SelectOutput> = [
    { label: 'Open', value: TodoStatus.Open },
    { label: 'Doing', value: TodoStatus.Doing },
    { label: 'Pending', value: TodoStatus.Pending },
    { label: 'Done', value: TodoStatus.Done },
];