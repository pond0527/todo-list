import reportWebVitals from 'lib/reportWebVitals';
import Link from 'next/link';

const Home = () => {
    return (
        <ul>
            <li>
                <Link href="/todo">TODOリスト</Link>
            </li>
            <li>
                <Link href="/member">担当者リスト</Link>
            </li>
        </ul>
    );
};

export default Home;

reportWebVitals();
