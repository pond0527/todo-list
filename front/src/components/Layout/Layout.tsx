import clsx from 'clsx';
import styles from './Styles.module.scss';
import { ReactNode, useEffect } from 'react';
import { PageHeader } from 'components/PageHeader';
import { useToast } from '../../lib/toast';

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
        <div className={clsx('container-xl container-sm', styles.container)}>
            <PageHeader title={pageTitle} rightItems={rightItems} />
            {children}
            <Toaster />
        </div>
    );
};
