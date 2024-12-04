import clsx from 'clsx';
import { PageHeader } from 'components/PageHeader';
import Link from 'next/link';
import { ReactNode, useEffect } from 'react';
import { useToast } from '../../lib/toast';
import styles from './Styles.module.scss';

type Props = {
    pageTitle: string;
    rightItems?: ReactNode;
    children: ReactNode;
};

export const Layout = ({ pageTitle, rightItems, children }: Props) => {
    useEffect(() => {
        document.title = pageTitle;
    }, [pageTitle]);

    const { Toaster } = useToast();

    return (
        <>
            <div>
                <Link href="/">トップへ</Link>
            </div>

            <div
                className={clsx('container-xl container-sm', styles.container)}
            >
                <PageHeader title={pageTitle} rightItems={rightItems} />
                {children}
                <Toaster />
            </div>
        </>
    );
};
