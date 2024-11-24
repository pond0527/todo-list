import { RowDataPacket } from 'mysql2';

export interface Member extends RowDataPacket {
    member_id: string;
    name: string;
    is_deleted: boolean;
}

export interface Todo extends RowDataPacket {
    todo_id: string;
    name: string;
    detail: string;
    assign_member_id: string;
    toto_status: string; // Open/Doing/Pending/Done
    is_warning: boolean;
    created_at: datetime;
    updated_at: datetime;
}

export interface TodoGroup extends RowDataPacket {
    group_id: string;
    name: string;
    is_deleted: boolean;
    updated_at: datetime;
}
