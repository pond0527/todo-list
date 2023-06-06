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
import { format } from 'date-fns';

type TodoFilter = Partial<
    Pick<TodoListJsonData, 'title' | 'status' | 'assignment'>
> & {
    showDone: boolean;
};

type Props = {
    memberList: Member[];
    statusList: Status[];
};

const TodoList = ({ memberList, statusList }: Props) => {
    const router = useRouter();
    const [todoList, setTodoList] = useState<TodoListJsonData[]>([]);
    const [filter, setFilter] = useState<TodoFilter>({showDone: false});

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
            <form className="form-inline-block">
                {/* <h5>検索条件</h5> */}
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={filter.showDone} 
                        id="defaultCheck1" 
                        onChange={(e) => {
                            setFilter(prev => ({...prev, showDone: e.target.checked }))
                        }}
                    />
                    <label className="form-check-label" htmlFor="defaultCheck1">
                    完了済みのタスクも表示
                    </label>
                </div>
                {/* <label className={clsx('my-2 mr-5')} htmlFor="statusSelectPref">
                    完了済みのタスクも表示
                </label>
                <select
                    id="statusSelectPref"
                    className="custom-select my-2 mr-5"
                    value={filter.status}
                    onChange={(e) => {
                        const value = e.target.value === '' ? undefined:e.target.value;
                        setFilter(prev => ({...prev, status: value }))
                    }}
                >
                    <option value={undefined} />
                    {statusList.map((status) => (
                        <option key={status.id} value={status.id}>
                            {status.label}
                        </option>
                    ))}
                </select> */}
            </form>
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
                            if(!filter.showDone && o.status === '4') {
                                return null;
                            } else {
                                return o;
                            }
                        })
                        .filter((o) => {
                            if(filter.status === undefined) {
                                return o;
                            }
                            if(filter.status === o.status) {
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
                                    key={todo.id}
                                    className={clsx(
                                        styles.dataRow,
                                        todo.status === '4' && styles.done,
                                        todo.status === '3' && styles.warn,
                                    )}
                                >
                                    <td className={'text-wrap'}>
                                        <Link href={`/todo/${todo.id}`}>
                                            {todo.title}
                                        </Link>
                                    </td>
                                    <td>
                                        {statusList.find(
                                            (o) => o.id === todo.status,
                                        )?.label || '-'}
                                    </td>
                                    <td className={'text-truncate'}>
                                        {todo.detail}
                                    </td>
                                    <td>
                                        {memberList.find(
                                            (o) => o.id === todo.assignment,
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
