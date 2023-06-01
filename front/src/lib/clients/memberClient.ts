import { ApiResoinse } from 'types/api/type';
import { Member } from 'types/todo/type';

export const getMemberList = async (): Promise<Member[]> => {
    const response = await fetch(`http://localhost:3000/api/member`, {
        method: 'GET',
    });

    const responseBody = (await response.json()) as ApiResoinse<Member[]>;

    return responseBody.data;
};
