import { Pool } from 'mysql2/promise';
import { Member } from 'types/mysql/type';
import { pool } from 'ports/database';
import logger from 'lib/logger';

export interface TodoRepository {
    fetchAll(): Promise<Member[]>;
    fetchBy(memberId: string): Promise<Member | undefined>;
    register(member: Member): Promise<boolean>;
    update(member: Member): Promise<boolean>;
    deleteBy(memberId: string): Promise<boolean>;
}

const TodoRepositoryImpl = (pool: Pool): TodoRepository => {
    const fetchAll = async (): Promise<Member[]> => {
        const con = await pool.getConnection();

        const [result] = await con.query<Member[]>(
            `select member_id, name, is_deleted from member`,
        );

        logger.info({ result: result }, 'result');
        return result;
    };

    const fetchBy = async (memberId: string): Promise<Member | undefined> => {
        const con = await pool.getConnection();

        const [results] = await con.query<Member[]>(
            `select member_id, name, is_deleted from member where member_id = :member_id`,
            { member_id: memberId },
        );

        return results[0];
    };

    const register = async (member: Member): Promise<boolean> => {
        try {
            const con = await pool.getConnection();

            await con.query(
                'insert into member values(:member_id, :name, :is_deleted)',
                { ...member },
            );
            return true;
        } catch (e: any) {
            logger.error(e);
            return false;
        }
    };

    const update = async (member: Member): Promise<boolean> => {
        try {
            const con = await pool.getConnection();
            await con.query(
                'update member set name = :name, is_deleted = :is_deleted where member_id = :member_id',
                { ...member },
            );
            return false;
        } catch (e: any) {
            logger.error(e);
            return false;
        }
    };

    const deleteBy = async (memberId: string): Promise<boolean> => {
        try {
            const con = await pool.getConnection();

            await con.query(
                'update member set is_deleted = true where member_id = :member_id',
                {
                    member_id: memberId,
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
