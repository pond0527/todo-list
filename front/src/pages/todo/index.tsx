import clsx from 'clsx';
import { Layout } from 'components/Layout';
import { TodoForm } from 'components/Todo';
import styles from 'components/Todo/todo.module.scss';
import { TODO_STATUS_LIST, TodoStatus } from 'constants/todo/status';
import { format } from 'date-fns';
import { getMemberList } from 'lib/clients/memberClient';
import { getTodoList } from 'lib/clients/todoClient';
import { useToast } from 'lib/toast';
import type { GetServerSidePropsResult } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import {
    MemberApiData,
    TodoFormType,
    TodoListJsonData,
} from 'types/todo/type.d';

type TodoFilter = Partial<
    Pick<TodoListJsonData, 'title' | 'status' | 'assignmentMemberId'>
> & {
    showDone: boolean;
};

type Props = {
    memberList: MemberApiData[];
};

const TodoList = ({ memberList }: Props) => {
    const router = useRouter();
    const [todoList, setTodoList] = useState<TodoListJsonData[]>([]);
    const [filter, setFilter] = useState<TodoFilter>({ showDone: false });

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        (async () => {
            const todoList = await getTodoList();
            setTodoList(todoList);
            console.log('todoList, ', todoList);
        })();
    }, [router.isReady]);

    const [isOpenFormModal, setIsOpenFormModal] = useState(false);
    const { toast, Toaster } = useToast();

    const useFormMethods = useForm<TodoFormType>();

    const handleClickCreate = useCallback(() => {
        useFormMethods.reset({
            title: '',
            status: TodoStatus.Open,
            assignmentMemberId: '0',
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
            <form className="form-inline-block">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={filter.showDone}
                        id="defaultCheck1"
                        onChange={(e) => {
                            setFilter((prev) => ({
                                ...prev,
                                showDone: e.target.checked,
                            }));
                        }}
                    />
                    <label className="form-check-label" htmlFor="defaultCheck1">
                        完了済みのタスクも含む
                    </label>
                </div>
            </form>

            <div>
                <div className="fw-bold mb-3">全{todoList.length}件</div>
                <table className={clsx('table table-hover', styles.table)}>
                    <thead className={'table-light'}>
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
                            .filter((o) => {
                                // フィルター1
                                if (
                                    !filter.showDone &&
                                    o.status === TodoStatus.Done
                                ) {
                                    // 完了ステータスは非表示
                                    return null;
                                } else {
                                    return o;
                                }
                            })
                            .filter((o) => {
                                if (filter.status === undefined) {
                                    return o;
                                }
                                if (filter.status === o.status) {
                                    return o;
                                }
                            })
                            .sort((o) => {
                                return o.updateAt
                                    ? o.updateAt.getTime()
                                    : o.createAt.getTime();
                            })
                            .reverse()
                            .map((todo) => {
                                return (
                                    <tr
                                        key={todo.todoId}
                                        className={clsx(
                                            styles.dataRow,
                                            todo.status === TodoStatus.Done &&
                                                styles.done,
                                            todo.isWarning && styles.warn,
                                        )}
                                    >
                                        <td className={'text-wrap'}>
                                            <Link href={`/todo/${todo.todoId}`}>
                                                {todo.title}
                                            </Link>
                                        </td>
                                        <td>
                                            {TODO_STATUS_LIST.find(
                                                (o) => o.value === todo.status,
                                            )?.label || '-'}
                                        </td>
                                        <td className={'text-truncate'}>
                                            {todo.detail}
                                        </td>
                                        <td>
                                            {memberList.find(
                                                (o) =>
                                                    o.memberId ===
                                                    todo.assignmentMemberId,
                                            )?.name || '-'}
                                        </td>
                                        <td>
                                            {format(
                                                todo.createAt,
                                                'yyyy-MM-dd HH:mm',
                                            )}
                                        </td>
                                        <td>
                                            {todo.updateAt
                                                ? format(
                                                      todo.updateAt,
                                                      'yyyy-MM-dd HH:mm',
                                                  )
                                                : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            <ReactModal
                isOpen={isOpenFormModal}
                overlayClassName="overlay"
                ariaHideApp={false}
                onRequestClose={() => {
                    setIsOpenFormModal(false);
                }}
            >
                <FormProvider {...useFormMethods}>
                    <TodoForm
                        mode={'new'}
                        memberList={memberList}
                        statusList={TODO_STATUS_LIST}
                        onComplete={handleComplete}
                        onBack={handleBack}
                    />
                </FormProvider>
            </ReactModal>
            <Toaster />
        </Layout>
    );
};

export default TodoList;

export const getServerSideProps = async (): Promise<
    GetServerSidePropsResult<Props>
> => {
    const memberList = await getMemberList();
    return {
        props: { memberList },
    };
};
