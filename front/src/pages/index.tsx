import { Layout } from 'components/Layout';
import reportWebVitals from 'lib/reportWebVitals';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const Home = () => {
    const { status } = useSession();

    const wrapContainer = () => {
        if (status === 'authenticated') {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-12 mb-4">
                            <ul>
                                <li>
                                    <Link href="/todo">TODO</Link>
                                </li>
                                {/* <li>
                    <Link href="/member">担当者リスト</Link>
                </li> */}
                                <li>
                                    <Link href="/user">ユーザー</Link>
                                </li>
                                {/* <li>
                                <Link href="#" onClick={() => signOut()}>
                                    サインアウト
                                </Link>
                            </li> */}
                            </ul>
                        </div>
                        <div className="col-12">
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => signOut()}
                            >
                                サインアウト
                            </button>
                        </div>
                    </div>
                </div>
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
        <Layout pageTitle="メニュー" showTopLink={false}>
            {wrapContainer()}
        </Layout>
    );
};

export default Home;

reportWebVitals();
