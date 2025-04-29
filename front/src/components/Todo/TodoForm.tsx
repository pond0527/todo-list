import clsx from 'clsx';
import { FormContainer } from 'components/FormContainer';
import { TodoStatus } from 'constants/todo/status';
import { useFormContext } from 'react-hook-form';
import { SelectOutput } from 'types/form';
import { MemberApiData, TodoFormType, TodoStatusType } from 'types/todo/type.d';
import { UserApiData } from 'types/user/type';
import styles from './todo.module.scss';

type Mode = 'new' | 'edit';

type Props = {
    mode: Mode;
    memberList: MemberApiData[];
    userList: UserApiData[];
    statusList: SelectOutput[];
    onComplete?: VoidFunction;
    onBack?: VoidFunction;
};

export const TodoForm = ({
    mode,
    onComplete,
    onBack,
    statusList,
    memberList,
    userList,
}: Props) => {
    const { register, getValues, setValue, formState } =
        useFormContext<TodoFormType>();

    const targetTodoId: string | undefined = getValues('todoId');
    console.log('targetTodoId: ', targetTodoId);

    const onSubmit = async (data: TodoFormType) => {
        await fetch(`http://localhost:3000/api/todo/${targetTodoId}`, {
            method: targetTodoId ? 'PUT' : 'POST',
            body: JSON.stringify(data),
        });

        onComplete?.();
    };

    const handleDelete = async () => {
        await fetch(`http://localhost:3000/api/todo/${targetTodoId}`, {
            method: 'DELETE',
        });

        onComplete?.();
    };

    return (
        <FormContainer
            pageTitle={`TODO　${mode === 'new' ? '新規作成' : '編集'}`}
            rightItems={
                <>
                    <button
                        type="button"
                        className={clsx('btn btn-primary', styles.btn)}
                        disabled={!formState.isValid}
                        onClick={() => onSubmit(getValues())}
                    >
                        保存
                    </button>

                    {mode === 'edit' && (
                        <button
                            className={clsx('btn btn-danger', styles.btn)}
                            onClick={handleDelete}
                        >
                            削除
                        </button>
                    )}

                    <button
                        type="button"
                        className={clsx('btn btn-secondary', styles.btn)}
                        onClick={onBack}
                    >
                        閉じる
                    </button>
                </>
            }
        >
            <form className={clsx('form')}>
                <div className={clsx(styles.formGroup)}>
                    <div className={clsx(styles.formItem)}>
                        <label className={clsx('form-label', styles.labelName)}>
                            タイトル
                        </label>
                        <input
                            type="text"
                            {...register('title', { required: true })}
                        ></input>
                    </div>

                    <div className={clsx(styles.formItem)}>
                        <label className={clsx('form-label', styles.labelName)}>
                            ステータス
                        </label>

                        <div className="form-group">
                            <select
                                className="form-select"
                                {...register('status', { required: true })}
                                defaultValue={getValues('status')}
                                onChange={(e) => {
                                    setValue(
                                        'status',
                                        (statusList.find(
                                            (o) => o.value === e.target.value,
                                        )?.value as TodoStatusType) ||
                                            TodoStatus.Open,
                                    );
                                }}
                            >
                                {statusList.map((status) => (
                                    <option
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {status.label}
                                    </option>
                                ))}
                            </select>

                            <div className="form-check">
                                <input
                                    id="isWarning"
                                    className="form-check-input"
                                    type="checkbox"
                                    {...register('isWarning')}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="isWarning"
                                >
                                    警告
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className={clsx(styles.formItem)}>
                        <label className={clsx('form-label', styles.labelName)}>
                            担当者
                        </label>
                        <select
                            className="form-select"
                            {...register('assignmentMemberId', {
                                required: true,
                            })}
                            defaultValue="0"
                        >
                            {userList.map((user) => (
                                <option key={user.userId} value={user.userId}>
                                    {user.name}
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
                            rows={10}
                            {...register('detail')}
                        />
                    </div>
                </div>
            </form>
        </FormContainer>
    );
};
