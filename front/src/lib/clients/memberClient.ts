import { ApiResoinse } from 'types/api/type';
import { MemberApiData } from 'types/todo/type';

export const getMemberList = async (): Promise<MemberApiData[]> => {
    const response = await fetch(`http://localhost:3000/api/member`, {
        method: 'GET',
    });

    const responseBody = (await response.json()) as ApiResoinse<
        MemberApiData[]
    >;

    return responseBody.data;
};
