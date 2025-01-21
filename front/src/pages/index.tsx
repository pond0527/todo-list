import { Layout } from 'components/Layout';
import reportWebVitals from 'lib/reportWebVitals';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const Home = () => {
    const { status } = useSession();
    const isSignin = status === 'authenticated';

    const wrapContainer = () => {
        if (isSignin) {
            return (
                <ul>
                    <li>
                        <Link href="/todo">TODO</Link>
                    </li>
                    <li>
                        <Link href="/user">ユーザー</Link>
                    </li>
                </ul>
            );
        } else {
            return (
                <ul>
                    <li>
                        <Link href="/signup">サインアップ</Link>
                    </li>
                    <li>
                        <Link href="/api/auth/signin">サインイン</Link>
                    </li>
                </ul>
            );
        }
    };

    return (
        <Layout
            pageTitle="メニュー"
            showTopLink={false}
            rightItems={
                <>
                    {isSignin && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => signOut()}
                        >
                            サインアウト
                        </button>
                    )}
                </>
            }
        >
            {wrapContainer()}
        </Layout>
    );
};

export default Home;

reportWebVitals();
