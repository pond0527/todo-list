import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
    user_id: string;
    name: string;
    password: string;
    salt: string;
    created_at: datetime;
    updated_at: datetime;
}