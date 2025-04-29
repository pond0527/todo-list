import {
    TodoJsonData,
    TodoFormType,
    TodoStatusType,
} from 'types/todo/type.d';
import { ApiResoinse } from 'types/api/type.d';
import { NextApiRequest, NextApiResponse } from 'next';
import { Todo } from 'types/mysql/todo';
import todoRepository from 'ports/todo-repository';
import { ulid } from 'ulid';
import { format } from 'date-fns';
import logger from 'lib/logger';
import { TodoStatus } from 'constants/todo/status';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiResoinse<boolean | TodoJsonData>>,
) => {
    console.log(req.query, req.body);

    const { todoId } = req.query;

    if (req.method === 'POST') {
        const form = JSON.parse(req.body) as TodoFormType;

        const registData = {
            todo_id: ulid(),
            name: form.title,
            detail: form.detail,
            assign_member_id: form.assignmentMemberId,
            toto_status: form.status,
            is_warning: form.isWarning,
            created_at: format(new Date(), 'yyyy-MM-dd HH-mm-ss'),
            updated_at: format(new Date(), 'yyyy-MM-dd HH-mm-ss'),
        } as Todo;

        const isSuccess = await todoRepository.register(registData);
        if (isSuccess) {
            res.status(200).json({
                data: {
                    todoId: registData.todo_id,
                    title: registData.name,

                    status: (registData.toto_status ??
                        TodoStatus.Open) as TodoStatusType,
                    assignmentMemberId: registData.assign_member_id,
                    isWarning: registData.is_warning,
                    detail: registData.detail,
                    createAt: new Date(registData.created_at),
                    updateAt: new Date(registData.updated_at),
                } as TodoJsonData,
            });
        } else {
            res.status(200).json({ data: false });
        }
    } else if (req.method === 'PUT') {
        if (todoId == null) {
            logger.warn('required totoId');
            res.status(400).end();
            return;
        }

        const form = JSON.parse(req.body) as TodoFormType;

        // シングルユーザーしかサポートしてないので競合は考慮しない
        const updateData = {
            todo_id: todoId,
            name: form.title,
            detail: form.detail,
            assign_member_id: form.assignmentMemberId,
            toto_status: form.status,
            is_warning: form.isWarning,
            updated_at: format(new Date(), 'yyyy-MM-dd HH-mm-ss'),
        } as Todo;

        const isSuccess = await todoRepository.update(updateData);
        res.status(200).json({ data: isSuccess });
    } else if (req.method === 'GET') {
        if (todoId == null) {
            logger.warn('required totoId');
            res.status(400).end();
            return;
        }

        const todo: Todo | undefined = await todoRepository.fetchBy(
            String(todoId),
        );

        if (todo) {
            res.status(200).json({
                data: {
                    todoId: todo.todo_id,
                    title: todo.name,
                    status: (todo.toto_status ??
                        TodoStatus.Open) as TodoStatusType,
                    assignmentMemberId: todo.assign_member_id,
                    isWarning: todo.is_warning,
                    detail: todo.detail,
                    createAt: new Date(todo.created_at),
                    updateAt: new Date(todo.updated_at),
                } as unknown as TodoJsonData,
            });
        } else {
            logger.warn(`not found, todoId=${todoId}`);
            res.status(404).end();
        }
    } else if (req.method === 'DELETE') {
        if (todoId == null) {
            logger.warn('required totoId');
            res.status(400);
            return;
        }

        const isSuccess = await todoRepository.deleteBy(todoId.toString());
        res.status(200).json({ data: isSuccess });
    } else {
        res.status(403).end();
    }
};

export default handler;
