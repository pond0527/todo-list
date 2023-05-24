import { ReactNode } from 'react';
import styles from './Styles.module.scss';
type Props = {
    title: string;
    rightItems?: ReactNode;
};
export const PageHeader = ({ title, rightItems }: Props) => {
    return (
        <div className={styles.header}>
            <h1>
                <label>{title}</label>
            </h1>

            {rightItems && <div className={styles.rightItems}>{rightItems}</div>}
        </div>
    );
};
