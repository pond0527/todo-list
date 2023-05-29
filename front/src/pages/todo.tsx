import {
    Member,
    Status,
    TodoFormType,
    TodoListJsonData,
} from 'types/todo/type.d';
import { ApiResoinse } from 'types/api/type.d';
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

type Props = {
    todoList: TodoListJsonData[];
    memberList: Member[];
    statusList: Status[];
};

const TodoList = ({ todoList, memberList, statusList }: Props) => {
    const router = useRouter();
    const [isOpenFormModal, setIsOpenFormModal] = useState(false);
    const { toast, Toaster } = useToast();
    const [isEdit, setIsEdit] = useState(false);
    const useFormMethods = useForm<TodoFormType>();

    const handleEditTodo = useCallback(
        (todoId: number) => {
            setIsEdit(true);
            useFormMethods.resetField('id', {
                defaultValue: todoId,
                keepDirty: true,
            });

            const editTodo = todoList.find((o) => o.id === todoId);
            useFormMethods.reset(editTodo);
            setIsOpenFormModal(true);
        },
        [useFormMethods, todoList],
    );

    const handleBack = useCallback(() => {
        setIsOpenFormModal(false);
        setIsEdit(false);

        // TODO: フォームの初期化
        useFormMethods.reset({ id: todoList.length + 1 });
    }, [useFormMethods, todoList]);

    const handleComplateNewTodo = useCallback(() => {
        setIsOpenFormModal(false);

        // TODO: フォームの初期化
        useFormMethods.reset();
        toast.success('保存しました。');

        router.reload();
    }, [router, useFormMethods, toast]);

    return (
        <Layout
            pageTitle="TODOリスト"
            rightItems={
                <>
                    <button
                        className={clsx('btn btn-primary', styles.btn)}
                        onClick={() => setIsOpenFormModal(true)}
                    >
                        新規作成
                    </button>
                </>
            }
        >
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
                    {todoList
                        .sort((o) => o.id)
                        .reverse()
                        .map((todo) => (
                            <tr
                                key={todo.id}
                                onClick={() => handleEditTodo(todo.id)}
                            >
                                <td>{todo.title}</td>
                                <td suppressHydrationWarning>
                                    {statusList.find(
                                        (o) => o.id === todo.status,
                                    )?.label || '-'}
                                </td>
                                <td suppressHydrationWarning>{todo.detail}</td>
                                <td suppressHydrationWarning>
                                    {memberList.find(
                                        (o) => o.id === todo.assignment,
                                    )?.name || '-'}
                                </td>
                                <td suppressHydrationWarning>
                                    {todo.createAt.toLocaleString()}
                                </td>
                                <td suppressHydrationWarning>
                                    {todo.updateAt?.toLocaleString() || '-'}
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
                        mode={isEdit ? 'edit' : 'new'}
                        todoId={useFormMethods.getValues('id')}
                        memberList={memberList}
                        statusList={statusList}
                        onComplate={handleComplateNewTodo}
                        onBack={handleBack}
                    />
                </ReactModal>
            </FormProvider>

            <Toaster />
        </Layout>
    );
};

export default TodoList;

export const getServerSideProps = async (
    context: any,
): Promise<GetServerSidePropsResult<Props>> => {
    console.log('## start getServerSideProps');
    const todoList = await getTodoList();
    const memberList = await getMemberList();
    const statusList = await getStatusList();
    console.log('## end getServerSideProps');
    return {
        props: { todoList, memberList, statusList },
    };
};

const getTodoList = async (): Promise<TodoListJsonData[]> => {
    const response = await fetch(`http://localhost:3000/api/todo`, {
        method: 'GET',
    });

    const responseBody = (await response.json()) as ApiResoinse<
        TodoListJsonData[]
    >;

    return responseBody.data;
};

const getMemberList = async (): Promise<Member[]> => {
    const response = await fetch(`http://localhost:3000/api/member`, {
        method: 'GET',
    });

    const responseBody = (await response.json()) as ApiResoinse<Member[]>;

    return responseBody.data;
};

const getStatusList = async (): Promise<Status[]> => {
    const response = await fetch(`http://localhost:3000/api/status`, {
        method: 'GET',
    });

    const responseBody = (await response.json()) as ApiResoinse<Status[]>;

    return responseBody.data;
};
