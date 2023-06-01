import { ApiResoinse } from "types/api/type";
import { Status } from "types/todo/type";

export const getStatusList = async (): Promise<Status[]> => {
    const response = await fetch(`http://localhost:3000/api/status`, {
        method: 'GET',
    });

    const responseBody = (await response.json()) as ApiResoinse<Status[]>;

    return responseBody.data;
};
