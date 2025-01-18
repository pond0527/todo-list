import reportWebVitals from 'lib/reportWebVitals';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const Home = () => {
    const { status } = useSession();

    if (status === 'authenticated') {
        return (
            <ul>
                <li>
                    <Link href="/todo">TODOリスト</Link>
                </li>
                <li>
                    <Link href="/member">担当者リスト</Link>
                </li>
                <li>
                    <Link href="#" onClick={() => signOut()}>
                        Sign out
                    </Link>
                </li>
            </ul>
        );
    } else {
        return (
            <ul>
                <li>
                    <Link href="/signup">Sign up</Link>
                </li>
                <li>
                    <Link href="/api/auth/signin">Sign in</Link>
                </li>
            </ul>
        );
    }
};

export default Home;

reportWebVitals();
