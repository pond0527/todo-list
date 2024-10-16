import { Pool } from 'mysql2/promise';
import { Todo } from 'types/mysql/type';
import { pool } from 'ports/database';
import logger from 'lib/logger';

export interface TodoRepository {
    fetchAll(): Promise<Todo[]>;
    fetchBy(todoId: string): Promise<Todo | undefined>;
    register(todo: Todo): Promise<boolean>;
    update(todo: Todo): Promise<boolean>;
    deleteBy(todoId: string): Promise<boolean>;
}

const TodoRepositoryImpl = (pool: Pool): TodoRepository => {
    const fetchAll = async (): Promise<Todo[]> => {
        const con = await pool.getConnection();

        const [result] = await con.query<Todo[]>(
            `select todo_id, name, detail, assign_member_id, toto_status, is_warning, created_at, updated_at from todo`,
        );

        logger.info({ result: result }, 'result');
        return result;
    };

    const fetchBy = async (todoId: string): Promise<Todo | undefined> => {
        const con = await pool.getConnection();

        const [results] = await con.query<Todo[]>(
            `select todo_id, name, detail, assign_member_id, toto_status, is_warning, created_at, updated_at from todo where todo_id = :todo_id`,
            { todo_id: todoId },
        );

        return results[0];
    };

    const register = async (todo: Todo): Promise<boolean> => {
        try {
            const con = await pool.getConnection();

            await con.query(
                'insert into todo values(:todo_id, :name, :detail, :assign_member_id, :toto_status, :is_warning, :created_at, :updated_at)',
                { ...todo },
            );
            return true;
        } catch (e: any) {
            logger.error(e);
            return false;
        }
    };

    const update = async (todo: Todo): Promise<boolean> => {
        try {
            const con = await pool.getConnection();
            await con.query(
                'update todo set name = :name, detail = :detail, assign_member_id = :assign_member_id, toto_status = :toto_status, is_warning = :is_warning, created_at = :created_at, updated_at = :updated_at where todo_id = :todo_id',
                { ...todo },
            );
            return false;
        } catch (e: any) {
            logger.error(e);
            return false;
        }
    };

    const deleteBy = async (todoId: string): Promise<boolean> => {
        try {
            const con = await pool.getConnection();

            await con.query(
                'update todo set is_deleted = true where todo_id = :todo_id',
                {
                    todo_id: todoId,
                },
            );

            return true;
        } catch (e: any) {
            logger.error(e);
            return false;
        }
    };

    return {
        fetchAll,
        fetchBy,
        register,
        update,
        deleteBy,
    };
};

export default TodoRepositoryImpl(pool);
