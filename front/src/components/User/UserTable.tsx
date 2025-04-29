import clsx from 'clsx';
import { getUserList } from 'lib/clients/userClient';
import { useEffect, useState } from 'react';
import { UserApiData } from 'types/user/type';
import styles from './UserTablle.module.scss';

export const UserTable = () => {
    const [userList, setUserList] = useState<Array<UserApiData>>([]);

    useEffect(() => {
        (async () => {
            const result = await getUserList();
            setUserList(result);
        })();
    }, []);

    return (
        <div>
            <div className="fw-bold mb-3">全{userList.length}件</div>
            <table className={clsx('table table-hover', styles.table)}>
                <thead className={'table-light'}>
                    <tr>
                        <th>ユーザー名</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.reverse().map((user) => {
                        return (
                            <tr
                                key={user.userId}
                                className={clsx(styles.dataRow)}
                            >
                                <td className={'text-wrap'}>{user.name}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
