import { ApiResoinse, TodoListJsonData } from 'components/Todo/types';
import styles from 'components/Todo/todo.module.scss';
import clsx from 'clsx';
import { Layout } from 'components/Layout';
import { useEffect, useState } from 'react';
import { NewTodo } from 'components/Todo/NewTodo';
import type { GetServerSidePropsResult } from 'next';

type Props = {
    todoList: TodoListJsonData[];
};

const TodoList = ({ todoList }: Props) => {
    const [isNewArea, setIsNewArea] = useState(false);
    useEffect(() => {
        console.log('## start TodoList');
        console.log('todoList: ', todoList);
        console.log(todoList.length, typeof todoList);

        return () => {
            console.log('## end TodoList');
        };
    }, [todoList]);

    return (
        <Layout
            pageTitle="TODOリスト"
            rightItems={
                <>
                    <button
                        className={clsx('btn btn-primary', styles.btn)}
                        onClick={() => setIsNewArea(true)}
                    >
                        新規作成
                    </button>
                </>
            }
        >
            {isNewArea && <NewTodo todoId={todoList.length * 1} />}

            <label className={clsx('form-label', styles.labelName)}>一覧</label>
            <table className="table">
                <thead>
                    <tr>
                        <th>タイトル</th>
                        <th>ステータス</th>
                        <th>内容</th>
                        <th>担当者</th>
                        <th>起票日</th>
                        <th>更新日</th>
                    </tr>
                </thead>
                <tbody>
                    {todoList.map((todo) => (
                        <tr key={todo.id}>
                            <td>{todo.title}</td>
                            <td>{todo.status}</td>
                            <td>{todo.detail}</td>
                            <td>{todo.assignment}</td>
                            <td>{todo.createAt.toLocaleString()}</td>
                            <td>{todo.updateAt?.toLocaleString() || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default TodoList;

export const getServerSideProps = async (
    context: any,
): Promise<GetServerSidePropsResult<Props>> => {
    console.log('## start getServerSideProps');
    const response = await fetch(`http://localhost:3000/api/todo`, {
        method: 'GET',
    });

    const responseBody = (await response.json()) as ApiResoinse<
        TodoListJsonData[]
    >;
    console.log('responseBody: ', responseBody);
    console.log(typeof responseBody.data);

    console.log('## end getServerSideProps');
    return {
        props: { todoList: responseBody.data }, // will be passed to the page component as props
    };
};
