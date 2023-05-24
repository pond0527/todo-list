import clsx from 'clsx';
import { Layout } from 'components/Layout';
import styles from './todo.module.scss';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
// import {promises} from 'fs';

export const TodoList = () => {
    const [isNewArea, setIsNewArea] = useState(false);

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
            {isNewArea && <NewTodo />}

            <label className={clsx('form-label', styles.labelName)}>一覧</label>
            <table className="table">
                <thead>
                    <tr>
                        <th>名前</th>
                        <th>ステータス</th>
                        <th>担当者</th>
                        <th>起票日</th>
                        <th>更新日</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>名前</td>
                        <td>ステータス</td>
                        <td>担当者</td>
                        <td>起票日</td>
                        <td>更新日</td>
                    </tr>
                </tbody>
            </table>
        </Layout>
    );
};

type TodoFormType = Pick<TodoListJsonData, 'title' | 'status' | 'detail'>;

type TodoListJsonData = {
    id: number;
    title: string;
    status: '0' | '1' | '2' | '3' | '4';
    detail: string;
    createAt: Date;
    updateAt?: Date;
};

const NewTodo = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<TodoFormType>();

    const onSubmit = async (data: TodoFormType) => {
        console.log(data);
        // promises.readFile('./share/todo-list.json', 'utf-8', (err, data) => {
        //     if (err) {
        //         //エラー処理
        //         console.log(err);
        //         return;
        //     }

        //     console.log(data as unknown as TodoListJsonData[])
        // });
        // const restore = await promises.readFile('./share/todo-list.json');
        // console.log(restore as unknown as TodoListJsonData[])

        // fs.writeFile('./share/todo-list.json', JSON.stringify(data), (err) => {
        //     if (err) {
        //         //エラー処理
        //         console.log(err);
        //         return;
        //     }
        // });
        // promises.writeFile('./share/todo-list.json', JSON.stringify({...data, createAt: new Date(), id: restore.length + 1} as TodoListJsonData));
    };

    return (
        <form className={clsx('form')} onSubmit={handleSubmit(onSubmit)}>
            <div className={clsx(styles.formGroup)}>
                <div className={clsx(styles.formItem)}>
                    <label className={clsx('form-label', styles.labelName)}>
                        タイトル
                    </label>
                    <input type="text" {...register('title')}></input>
                </div>

                <div className={clsx(styles.formItem)}>
                    <label className={clsx('form-label', styles.labelName)}>
                        ステータス
                    </label>
                    <select
                        className="form-select"
                        {...register('status')}
                        defaultValue="0"
                    >
                        <option value="0">Open</option>
                        <option value="1">Doing</option>
                        <option value="2">Pending</option>
                        <option value="3">Warn</option>
                        <option value="4">Done</option>
                    </select>
                </div>

                <div className={clsx(styles.formItem)}>
                    <label className={clsx('form-label', styles.labelName)}>
                        内容
                    </label>
                    <textarea
                        className="form-control"
                        {...register('detail')}
                    />
                </div>

                <input type="submit" />
            </div>
        </form>
    );
};
