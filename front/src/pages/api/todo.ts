import { TodoListJsonData } from 'types/todo/type.d';
import { ApiResoinse } from 'types/api/type.d';
import { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'path';
import todoRepository from 'ports/todo-repository';
import logger from 'lib/logger';

export const TODO_LIST_FILEPATH = join(process.cwd(), 'share/todo-list.json');
console.log(TODO_LIST_FILEPATH);

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiResoinse<TodoListJsonData[]>>,
) => {
    if (req.method === 'GET') {
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
                        detail: data.detail,
                        createAt: data.created_at,
                        updateAt: data.updated_at,
                    } as TodoListJsonData),
            ),
        });
    } else {
        res.status(403);
    }
};

export default handler;
