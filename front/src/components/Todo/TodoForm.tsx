import clsx from 'clsx';
import styles from './todo.module.scss';
import { Member, Status, TodoFormType } from 'types/todo/type.d';
import { useFormContext } from 'react-hook-form';

type Props = {
    todoId: number;
    memberList: Member[];
    statusList: Status[];
    onComplate?: VoidFunction;
    onBack?: VoidFunction;
};

export const TodoForm = ({
    todoId,
    onComplate,
    onBack,
    statusList,
    memberList,
}: Props) => {
    const { register, handleSubmit } = useFormContext<TodoFormType>();

    const onSubmit = async (data: TodoFormType) => {
        await fetch(`http://localhost:3000/api/todo/${todoId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });

        onComplate?.();
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
                        {statusList.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.label}
                            </option>
                        ))}
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
                        {memberList.map((member) => (
                            <option key={member.id} value={member.id}>
                                {member.name}
                            </option>
                        ))}
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

                <button
                    type="submit"
                    className={clsx('btn btn-primary me-3', styles.btn)}
                >
                    保存
                </button>
                <button
                    type="button"
                    className={clsx('btn btn-secondary', styles.btn)}
                    onClick={onBack}
                >
                    閉じる
                </button>
            </div>
        </form>
    );
};
