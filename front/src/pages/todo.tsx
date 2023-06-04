import {
    Member,
    Status,
    TodoFormType,
    TodoListJsonData,
} from 'types/todo/type.d';
import styles from 'components/Todo/todo.module.scss';
import clsx from 'clsx';
import { Layout } from 'components/Layout';
import { useCallback, useEffect, useState } from 'react';
import type { GetServerSidePropsResult } from 'next';
import ReactModal from 'react-modal';
import { useToast } from 'lib/toast';
import { TodoForm } from 'components/Todo';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createTodoId, getTodoList } from 'lib/clients/todoClient';
import { getMemberList } from 'lib/clients/memberClient';
import { getStatusList } from 'lib/clients/statusClient';

type Props = {
    memberList: Member[];
    statusList: Status[];
};

const TodoList = ({ memberList, statusList }: Props) => {
    const router = useRouter();
    const [todoList, setTodoList] = useState<TodoListJsonData[]>([]);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        (async () => {
            const todoList = await getTodoList();
            setTodoList(todoList);
        })();
    }, [router.isReady]);

    const [isOpenFormModal, setIsOpenFormModal] = useState(false);
    const { toast, Toaster } = useToast();

    const useFormMethods = useForm<TodoFormType>();

    const handleClickCreate = useCallback(async () => {
        const newTodoId = await createTodoId();
        useFormMethods.reset({
            id: newTodoId,
            title: '',
            status: '0',
            assignment: '0',
            detail: '',
        });

        setIsOpenFormModal(true);
    }, [useFormMethods]);

    const handleBack = useCallback(() => {
        setIsOpenFormModal(false);
    }, []);

    const handleComplete = useCallback(async () => {
        // リストを最新化
        const todoList = await getTodoList();
        setTodoList(todoList);

        setIsOpenFormModal(false);
        toast.success('保存しました。');
    }, [toast]);

    return (
        <Layout
            pageTitle="TODOリスト"
            rightItems={
                <>
                    <button
                        className={clsx('btn btn-primary', styles.btn)}
                        onClick={handleClickCreate}
                    >
                        新規作成
                    </button>
                </>
            }
        >
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
                    {todoList
                        .sort((o) => o.id)
                        .reverse()
                        .map((todo) => (
                            <tr
                                key={todo.id}
                                className={clsx(
                                    styles.dataRow,
                                    todo.status === '4' && styles.done,
                                    todo.status === '3' && styles.warn,
                                )}
                            >
                                <td>
                                    <Link href={`/todo/${todo.id}`}>
                                        {todo.title}
                                    </Link>
                                </td>
                                <td>
                                    {statusList.find(
                                        (o) => o.id === todo.status,
                                    )?.label || '-'}
                                </td>
                                <td>{todo.detail}</td>
                                <td>
                                    {memberList.find(
                                        (o) => o.id === todo.assignment,
                                    )?.name || '-'}
                                </td>
                                <td>{todo.createAt.toLocaleString('ja-JP')}</td>
                                <td>
                                    {todo.updateAt?.toLocaleString('ja-JP') ||
                                        '-'}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            <FormProvider {...useFormMethods}>
                <ReactModal
                    isOpen={isOpenFormModal}
                    overlayClassName="overlay"
                    ariaHideApp={false}
                    onRequestClose={() => {
                        setIsOpenFormModal(false);
                    }}
                >
                    <TodoForm
                        mode={'new'}
                        memberList={memberList}
                        statusList={statusList}
                        onComplete={handleComplete}
                        onBack={handleBack}
                    />
                </ReactModal>
            </FormProvider>

            <Toaster />
        </Layout>
    );
};

export default TodoList;

export const getServerSideProps = async (): Promise<
    GetServerSidePropsResult<Props>
> => {
    console.log('## start getServerSideProps');
    const memberList = await getMemberList();
    const statusList = await getStatusList();
    console.log('## end getServerSideProps');
    return {
        props: { memberList, statusList },
    };
};
