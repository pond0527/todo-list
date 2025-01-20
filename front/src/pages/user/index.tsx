import { Layout } from 'components/Layout';
import { UserTable } from 'components/User';

const UserList = (): JSX.Element => {
    return (
        <Layout pageTitle="ユーザー一覧">
            <UserTable />
        </Layout>
    );
};

export default UserList;
