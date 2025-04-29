import { Pool } from 'mysql2/promise';
import { User } from 'types/mysql/user';
import { pool } from 'ports/database';
import logger from 'lib/logger';

export interface UserRepository {
    fetchAll(): Promise<User[]>;
    fetchBy(userName: string): Promise<User | undefined>;
    register(user: User): Promise<boolean>;
    update(user: User): Promise<boolean>;
    // deleteBy(todoId: string): Promise<boolean>;
}

const UserRepositoryImpl = (pool: Pool): UserRepository => {
    const fetchAll = async (): Promise<User[]> => {
        const con = await pool.getConnection();

        const [result] = await con.query<User[]>(
            `select user_id, name, password, salt, created_at, updated_at from user`,
        );

        logger.info({ result: result }, 'result');
        return result;
    };

    const fetchBy = async (userName: string): Promise<User | undefined> => {
        const con = await pool.getConnection();

        const [results] = await con.query<User[]>(
            `select user_id, name, password, salt, created_at, updated_at from user where name = :name`,
            { name: userName },
        );

        return results[0];
    };

    const register = async (user: User): Promise<boolean> => {
        try {
            const con = await pool.getConnection();

            await con.query(
                'insert into user values(:user_id, :name, :password, :salt, :created_at, :updated_at)',
                { ...user },
            );
            return true;
        } catch (e: any) {
            logger.error(e);
            return false;
        }
    };

    const update = async (user: User): Promise<boolean> => {
        try {
            const con = await pool.getConnection();
            await con.query(
                'update user set name = :name, password = :password, :salt, updated_at = :updated_at where user_id = :user_id',
                { ...user },
            );
            return true;
        } catch (e: any) {
            logger.error(e);
            return false;
        }
    };

    // const deleteBy = async (todoId: string): Promise<boolean> => {
    //     try {
    //         const con = await pool.getConnection();

    //         await con.query('delete from todo where todo_id = :todo_id', {
    //             todo_id: todoId,
    //         });

    //         return true;
    //     } catch (e: any) {
    //         logger.error(e);
    //         return false;
    //     }
    // };

    return {
        fetchAll,
        fetchBy,
        register,
        update,
        // deleteBy,
    };
    
};

export default UserRepositoryImpl(pool);
