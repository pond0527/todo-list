import { TodoListJsonData } from 'types/todo/type.d';
import { ApiResoinse } from 'types/api/type.d';
import { NextApiRequest, NextApiResponse } from 'next';
import todoRepository from 'ports/todo-repository';
import logger from 'lib/logger';

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiResoinse<TodoListJsonData[]>>,
) => {
    if (req.method === 'GET') {
        try {
            const todoList = await todoRepository.fetchAll();
            logger.info({ todoList: todoList }, 'Get: todoList');

            res.status(200).send({
                data: todoList.map(
                    (data) =>
                        ({
                            todoId: data.todo_id,
                            title: data.name,
                            status: data.toto_status,
                            assignment: data.assign_member_id,
                            isWarning: data.is_warning,
                            detail: data.detail,
                            createAt: data.created_at,
                            updateAt: data.updated_at,
                        } as TodoListJsonData),
                ),
            });
        } catch (e) {
            logger.warn(e);
            res.status(200).send({ data: [] });
        }
    } else {
        res.status(403);
    }
};

export default handler;
