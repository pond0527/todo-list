import { Pool } from 'mysql2/promise';
import { Member } from 'types/mysql/todo';
import { pool } from 'ports/database';
import logger from 'lib/logger';
import { TRUE } from 'sass';

export interface MemberRepository {
    fetchAll(): Promise<Member[]>;
    fetchBy(memberId: string): Promise<Member | undefined>;
    register(member: Member): Promise<boolean>;
    update(member: Member): Promise<boolean>;
    deleteBy(memberId: string): Promise<boolean>;
}

const MemberRepositoryImpl = (pool: Pool): MemberRepository => {
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
                'update member set name = :name where member_id = :member_id',
                { ...member },
            );
            return true;
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

export default MemberRepositoryImpl(pool);
