import { SelectOutput } from 'types/form';
import { TodoStatus } from 'types/todo/type.d';

export const TODO_STATUS_LIST: SelectOutput[] = [
    { label: 'Open', value: TodoStatus.Open },
    { label: 'Doing', value: TodoStatus.Doing },
    { label: 'Pending', value: TodoStatus.Pending },
    { label: 'Done', value: TodoStatus.Done },
] as const;
