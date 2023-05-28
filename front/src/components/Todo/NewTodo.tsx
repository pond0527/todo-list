import clsx from 'clsx';
import styles from './todo.module.scss';
import { TodoFormType, TodoListJsonData } from './types';
import { useForm } from 'react-hook-form';

export const NewTodo = ({ todoId }: { todoId: number }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<TodoFormType>();

    const onSubmit = async (data: TodoFormType) => {
        return fetch(`http://localhost:3000/api/todo/${todoId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
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
                        担当者
                    </label>
                    <select
                        className="form-select"
                        {...register('assignment')}
                        defaultValue="0"
                    >
                        <option value="0">XX</option>
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
