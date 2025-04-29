import { ApiResoinse } from 'types/api/type';
import { UserApiData, UserFormType } from 'types/user/type';

export const getUserList = async (): Promise<UserApiData[]> => {
    const response = await fetch(`http://localhost:3000/api/user`, {
        method: 'GET',
    });

    const responseBody = (await response.json()) as ApiResoinse<
    UserApiData[]
    >;

    return responseBody.data;
};

// export const getUser = async (userId: string): Promise<UserApiData> => {
//     const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
//         method: 'GET',
//     });

//     const responseBody =
//         (await response.json()) as ApiResoinse<UserApiData>;

//     return responseBody.data;
// };

export const registerUser = async (userForm: UserFormType): Promise<boolean> => {
    const response = await fetch(`http://localhost:3000/api/user`, {
        method: 'POST',
        body: JSON.stringify(userForm),
    });

    if (response.ok) {
        return true;
    } else if (response.status === 400) {
        throw new DuplicateUserError();
    } else {
        return false
    }
};

export class DuplicateUserError extends Error {};