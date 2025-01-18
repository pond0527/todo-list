import clsx from 'clsx';
import { FormContainer } from 'components/FormContainer';
import { useFormContext } from 'react-hook-form';
import { MemberFormType } from 'types/todo/type.d';
import styles from './member.module.scss';

type Mode = 'new' | 'edit';

type Props = {
    mode: Mode;
    onComplete?: VoidFunction;
    onBack?: VoidFunction;
};

export const MemberForm = ({ mode, onComplete, onBack }: Props) => {
    const { register, getValues, formState } = useFormContext<MemberFormType>();

    const targetMemberId: string | undefined = getValues('memberId');
    console.log('targetTodoId: ', targetMemberId);

    const onSubmit = async (data: MemberFormType) => {
        await fetch(`http://localhost:3000/api/member/${targetMemberId}`, {
            method: targetMemberId ? 'PUT' : 'POST',
            body: JSON.stringify(data),
        });

        onComplete?.();
    };

    const handleDelete = async () => {
        await fetch(`http://localhost:3000/api/member/${targetMemberId}`, {
            method: 'DELETE',
        });

        onComplete?.();
    };

    return (
        <FormContainer
            pageTitle={`担当者　${mode === 'new' ? '新規作成' : '編集'}`}
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
                            担当者名
                        </label>
                        <input
                            type="text"
                            {...register('name', { required: true })}
                        ></input>
                    </div>
                </div>
            </form>
        </FormContainer>
    );
};
